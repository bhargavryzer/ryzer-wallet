import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityLog, SecurityLogDocument } from '../schemas/security-log.schema';
import { Device, DeviceDocument } from '../schemas/device.schema';
import { SecurityEventType, SecurityEventSeverity } from '../schemas/security-log.schema';
import { User } from '../../users/schemas/user.schema';
import * as geoip from 'geoip-lite';

@Injectable()
export class SecurityService {
  constructor(
    @InjectModel(SecurityLog.name) private securityLogModel: Model<SecurityLogDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}

  async logSecurityEvent(
    userId: string,
    eventType: SecurityEventType,
    severity: SecurityEventSeverity,
    description: string,
    metadata: any = {},
  ) {
    const log = new this.securityLogModel({
      userId,
      eventType,
      severity,
      description,
      metadata,
      requiresAction: severity === SecurityEventSeverity.CRITICAL,
    });
    return log.save();
  }

  async registerDevice(
    userId: string,
    deviceId: string,
    name: string,
    type: string,
    userAgent: string,
    ipAddress: string,
  ) {
    const location = geoip.lookup(ipAddress);
    const device = new this.deviceModel({
      userId,
      deviceId,
      name,
      type,
      userAgent,
      ipAddress,
      location: location ? {
        country: location.country,
        city: location.city,
        latitude: location.ll[0],
        longitude: location.ll[1],
      } : null,
    });
    return device.save();
  }

  async getDeviceHistory(userId: string) {
    return this.deviceModel.find({ userId }).exec();
  }

  async getSecurityLogs(userId: string, limit = 100) {
    return this.securityLogModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async markDeviceAsTrusted(deviceId: string, userId: string) {
    return this.deviceModel.findOneAndUpdate(
      { deviceId, userId },
      {
        isTrusted: true,
        trustedAt: new Date(),
        status: 'ACTIVE',
      },
      { new: true },
    );
  }

  async blockDevice(deviceId: string, userId: string) {
    return this.deviceModel.findOneAndUpdate(
      { deviceId, userId },
      { status: 'BLOCKED' },
      { new: true },
    );
  }

  async checkSuspiciousActivity(userId: string, ipAddress: string) {
    const recentLogs = await this.securityLogModel
      .find({
        userId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      })
      .exec();

    const ipCount = recentLogs.filter(log => log.ipAddress === ipAddress).length;
    return ipCount > 5; // More than 5 attempts in 24 hours
  }

  async getSecuritySummary(userId: string) {
    const [devices, logs] = await Promise.all([
      this.deviceModel.find({ userId }).exec(),
      this.securityLogModel.find({ userId }).exec(),
    ]);

    return {
      totalDevices: devices.length,
      trustedDevices: devices.filter(d => d.isTrusted).length,
      blockedDevices: devices.filter(d => d.status === 'BLOCKED').length,
      recentSecurityEvents: logs
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5),
      suspiciousActivity: logs.filter(
        log => log.severity === SecurityEventSeverity.CRITICAL,
      ).length,
    };
  }
} 