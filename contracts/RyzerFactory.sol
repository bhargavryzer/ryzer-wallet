// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

// Custodial Wallet Interface
interface ICustodialWalletUpgradeable {
    function initialize(address _custodian) external;
    function custodian() external view returns (address);
}

// MPC Wallet Interface
interface IMPCWalletUpgradeable {
    function initialize(address _entryPoint, address[] memory _owners, uint256 _threshold) external;
    function entryPoint() external view returns (address);
}

/// @title RyzerFactoryCore
/// @notice An upgradeable factory for creating custodial and MPC wallets using deterministic proxies
/// @dev Uses UUPS proxy pattern with timelock for upgradability and Clones for deterministic deployment
contract RyzerFactoryCore is Initializable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    // Custom errors
    error OnlyAdmin();
    error InvalidAdmin();
    error InvalidAddress();
    error UntrustedDkimKeys();
    error UntrustedVerifier();
    error UntrustedWebAuthnVerifier();
    error WalletExists();
    error ArrayLengthMismatch();
    error InvalidWalletType();
    error InvalidOwnerCount();
    error InvalidThreshold();
    error DuplicateOwner();
    error UpgradeNotProposed();
    error UpgradeNotReady();
    error UpgradeExpired();
    error InitializationFailed();

    // Enum for wallet types
    enum WalletType { Custodial, MPC }

    // State variables
    address public immutable custodialWalletImplementation;
    address public immutable mpcWalletImplementation;
    address public immutable entryPoint;
    address public admin;
    mapping(bytes32 => address) public wallets;
    mapping(address => bool) public trustedDkimKeys;
    mapping(address => bool) public trustedVerifiers;
    mapping(address => bool) public trustedPaymasters;
    mapping(address => bool) public trustedWebAuthnVerifiers;
    uint256 public upgradeDelay;
    mapping(address => UpgradeProposal) public upgradeProposals;
    uint256 public constant MIN_OWNERS = 2;
    uint256 public constant MAX_OWNERS = 5;

    struct UpgradeProposal {
        address newImplementation;
        uint256 timestamp;
        bool confirmed;
    }

    // Events
    event WalletDeployed(bytes32 indexed walletId, address wallet, WalletType walletType);
    event AdminUpdated(address indexed oldAdmin, address indexed newAdmin);
    event TrustedDkimKeysUpdated(address indexed dkimKeys, bool enabled);
    event TrustedVerifierUpdated(address indexed verifier, bool enabled);
    event TrustedPaymasterUpdated(address indexed paymaster, bool enabled);
    event TrustedWebAuthnVerifierUpdated(address indexed verifier, bool enabled);
    event Initialized(address admin, uint256 upgradeDelay);
    event UpgradeProposed(address indexed newImplementation, uint256 timestamp);
    event UpgradeConfirmed(address indexed newImplementation);
    event UpgradeExecuted(address indexed newImplementation);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(
        address _custodialWalletImplementation,
        address _mpcWalletImplementation,
        address _entryPoint
    ) {
        if (
            _custodialWalletImplementation == address(0) ||
            _mpcWalletImplementation == address(0) ||
            _entryPoint == address(0)
        ) {
            revert InvalidAddress();
        }
        custodialWalletImplementation = _custodialWalletImplementation;
        mpcWalletImplementation = _mpcWalletImplementation;
        entryPoint = _entryPoint;
        _disableInitializers();
    }

    /// @notice Initializes the contract
    /// @param _admin The initial admin address
    /// @param _upgradeDelay The delay for upgrades in seconds
    function initialize(address _admin, uint256 _upgradeDelay) public initializer {
        if (_admin == address(0)) revert InvalidAdmin();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        admin = _admin;
        upgradeDelay = _upgradeDelay;
        emit Initialized(_admin, _upgradeDelay);
        emit AdminUpdated(address(0), _admin);
    }

    /// @notice Proposes an upgrade to a new implementation
    /// @param newImplementation The address of the new implementation
    function proposeUpgrade(address newImplementation) external {
        if (msg.sender != admin) revert OnlyAdmin();
        if (newImplementation == address(0)) revert InvalidAddress();
        upgradeProposals[newImplementation] = UpgradeProposal({
            newImplementation: newImplementation,
            timestamp: block.timestamp,
            confirmed: false
        });
        emit UpgradeProposed(newImplementation, block.timestamp);
    }

    /// @notice Confirms an upgrade proposal
    /// @param newImplementation The address of the proposed implementation
    function confirmUpgrade(address newImplementation) external {
        if (msg.sender != admin) revert OnlyAdmin();
        UpgradeProposal storage proposal = upgradeProposals[newImplementation];
        if (proposal.newImplementation == address(0)) revert UpgradeNotProposed();
        if (block.timestamp < proposal.timestamp + upgradeDelay) revert UpgradeNotReady();
        if (block.timestamp > proposal.timestamp + upgradeDelay + 1 days) revert UpgradeExpired();
        proposal.confirmed = true;
        emit UpgradeConfirmed(newImplementation);
    }

    /// @notice Authorizes and executes an upgrade to a new implementation
    /// @param newImplementation The address of the new implementation
    function _authorizeUpgrade(address newImplementation) internal override {
        if (msg.sender != admin) revert OnlyAdmin();
        UpgradeProposal storage proposal = upgradeProposals[newImplementation];
        if (proposal.newImplementation == address(0)) revert UpgradeNotProposed();
        if (!proposal.confirmed) revert UpgradeNotReady();
        delete upgradeProposals[newImplementation];
        emit UpgradeExecuted(newImplementation);
    }

    // Admin Functions
    /// @notice Updates the admin address
    /// @param newAdmin The new admin address
    function updateAdmin(address newAdmin) external {
        if (msg.sender != admin) revert OnlyAdmin();
        if (newAdmin == address(0)) revert InvalidAdmin();
        address oldAdmin = admin;
        admin = newAdmin;
        emit AdminUpdated(oldAdmin, newAdmin);
    }

    /// @notice Updates the trusted status of DKIM keys
    /// @param dkimKeys The DKIM keys address
    /// @param enabled True to enable, false to disable
    function updateTrustedDkimKeys(address dkimKeys, bool enabled) external {
        if (msg.sender != admin) revert OnlyAdmin();
        trustedDkimKeys[dkimKeys] = enabled;
        emit TrustedDkimKeysUpdated(dkimKeys, enabled);
    }

    /// @notice Updates the trusted status of a verifier
    /// @param verifier The verifier address
    /// @param enabled True to enable, false to disable
    function updateTrustedVerifier(address verifier, bool enabled) external {
        if (msg.sender != admin) revert OnlyAdmin();
        trustedVerifiers[verifier] = enabled;
        emit TrustedVerifierUpdated(verifier, enabled);
    }

    /// @notice Updates the trusted status of a paymaster
    /// @param paymaster The paymaster address
    /// @param enabled True to enable, false to disable
    function updateTrustedPaymaster(address paymaster, bool enabled) external {
        if (msg.sender != admin) revert OnlyAdmin();
        trustedPaymasters[paymaster] = enabled;
        emit TrustedPaymasterUpdated(paymaster, enabled);
    }

    /// @notice Updates the trusted status of a WebAuthn verifier
    /// @param verifier The WebAuthn verifier address
    /// @param enabled True to enable, false to disable
    function updateTrustedWebAuthnVerifier(address verifier, bool enabled) external {
        if (msg.sender != admin) revert OnlyAdmin();
        trustedWebAuthnVerifiers[verifier] = enabled;
        emit TrustedWebAuthnVerifierUpdated(verifier, enabled);
    }

    // Wallet Creation
    /// @notice Creates a new wallet (custodial or MPC)
    /// @param walletType The type of wallet (Custodial or MPC)
    /// @param owner The owner (for Custodial) or primary owner (for MPC)
    /// @param mpcOwners Array of owners (for MPC wallets only)
    /// @param threshold Signature threshold (for MPC wallets only)
    /// @param salt Salt for deterministic address
    /// @param dkimKeys DKIM keys address
    /// @param verifier Verifier address
    /// @param webAuthnVerifier WebAuthn verifier address
    /// @return walletId The wallet ID
    /// @return wallet The deployed wallet address
    function createWallet(
        WalletType walletType,
        address owner,
        address[] memory mpcOwners,
        uint256 threshold,
        bytes32 salt,
        address dkimKeys,
        address verifier,
        address webAuthnVerifier
    ) external nonReentrant returns (bytes32 walletId, address wallet) {
        if (!trustedDkimKeys[dkimKeys]) revert UntrustedDkimKeys();
        if (!trustedVerifiers[verifier]) revert UntrustedVerifier();
        if (!trustedWebAuthnVerifiers[webAuthnVerifier]) revert UntrustedWebAuthnVerifier();
        if (owner == address(0)) revert InvalidAddress();

        walletId = keccak256(abi.encode(owner, block.chainid, salt));
        if (wallets[walletId] != address(0)) revert WalletExists();

        if (walletType == WalletType.Custodial) {
            wallet = Clones.cloneDeterministic(custodialWalletImplementation, keccak256(abi.encode(walletId)));
            (bool success,) = wallet.call(abi.encodeWithSelector(ICustodialWalletUpgradeable.initialize.selector, owner));
            if (!success) revert InitializationFailed();
        } else if (walletType == WalletType.MPC) {
            if (mpcOwners.length < MIN_OWNERS || mpcOwners.length > MAX_OWNERS) revert InvalidOwnerCount();
            if (threshold < 2 || threshold > mpcOwners.length) revert InvalidThreshold();
            // Validate MPC owners
            for (uint256 i = 0; i < mpcOwners.length; i++) {
                if (mpcOwners[i] == address(0)) revert InvalidAddress();
                for (uint256 j = i + 1; j < mpcOwners.length; j++) {
                    if (mpcOwners[i] == mpcOwners[j]) revert DuplicateOwner();
                }
            }
            wallet = Clones.cloneDeterministic(mpcWalletImplementation, keccak256(abi.encode(walletId)));
            (bool success,) = wallet.call(abi.encodeWithSelector(IMPCWalletUpgradeable.initialize.selector, entryPoint, mpcOwners, threshold));
            if (!success) revert InitializationFailed();
        } else {
            revert InvalidWalletType();
        }

        wallets[walletId] = wallet;
        emit WalletDeployed(walletId, wallet, walletType);
        return (walletId, wallet);
    }

    

    // Query Functions
    /// @notice Gets the address of a wallet
    /// @param walletId The wallet ID
    /// @return The wallet address (deployed or predicted)
    function getWalletAddress(bytes32 walletId) external view returns (address) {
        if (wallets[walletId] != address(0)) {
            return wallets[walletId];
        }
        return Clones.predictDeterministicAddress(
            custodialWalletImplementation,
            keccak256(abi.encode(walletId))
        );
    }
}