// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/interfaces/UserOperation.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

// Minimal interfaces for token standards
interface IERC20 {
    function safeTransfer(address to, uint256 amount) external;
    function safeTransferFrom(address from, address to, uint256 amount) external;
}

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

interface IERC1155 {
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
}

interface IERC721Receiver {
    function onERC721Received(address, address, uint256, bytes calldata) external returns (bytes4);
}

interface IERC1155Receiver {
    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external returns (bytes4);
    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external returns (bytes4);
}

interface IERC3643 {
    function transferFrom(address from, address to, uint256 value, bytes32 partition, bytes calldata data) external returns (bool);
    function balanceOf(address account, bytes32 partition) external view returns (uint256);
    function isValid(address account, bytes32 partition, uint256 value, bytes calldata data) external view returns (bool);
}

contract RyzerMPCWallet is Initializable, UUPSUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable, IERC721Receiver, IERC1155Receiver {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Custom errors
    error InvalidAddress();
    error TokenNotSupported();
    error InsufficientBalance();
    error InvalidDestination();
    error NotInitialized();
    error NotOwner();
    error NotEntryPoint();
    error InvalidSignatureLength();
    error InsufficientSignatures();
    error InvalidOwnerCount();
    error InvalidThreshold();
    error DuplicateOwner();
    error OwnerExists();
    error MaxOwnersReached();
    error BelowThreshold();
    error MinOwnersReached();
    error AlreadyApproved();
    error AlreadyExecuted();
    error NotApproved();
    error InvalidPartition();
    error ProposalNotFound();
    error ProposalNotConfirmed();
    error ProposalExpired();
    error NotGuardian();
    error RecoveryNotInitiated();
    error RecoveryNotConfirmed();
    error InsufficientGuardianSignatures();
    error InvalidGasLimit();

    // State Variables
    address[] public owners;
    mapping(address => uint256) public ownerIndices;
    uint256 public threshold;
    address public entryPoint;
    mapping(address => mapping(address => uint256)) public balances;
    mapping(address => mapping(address => mapping(uint256 => uint256))) public nftBalances;
    mapping(address => bool) public supportedTokens;
    mapping(address => bytes32) public tokenPartitions;
    mapping(uint256 => WithdrawalRequest) public withdrawalRequests;
    uint256 public requestCount;
    mapping(uint256 => AuditLog) public auditLogs;
    uint256 public auditLogCount;
    bool public isInitialized;
    uint256 public auditLogLevel; // 0: off, 1: critical, 2: all
    uint256 public ownerChangeDelay;
    uint256 public proposalCount;
    address[] public guardians;
    mapping(address => uint256) public guardianIndices;
    uint256 public guardianThreshold;
    uint256 public pauseProposalCount;
    uint256 public constant MAX_OWNERS = 5;
    uint256 public constant MIN_OWNERS = 2;
    uint256 public constant TRANSFER_GAS_LIMIT = 100_000;

    // Structs
    struct WithdrawalRequest {
        address user;
        address token;
        uint256 amount;
        uint256 tokenId;
        address to;
        bool approved;
        bool executed;
        bytes32 partition;
    }

    struct AuditLog {
        address actor;
        string action;
        uint256 timestamp;
        bytes32 dataHash;
    }

    struct OwnerChangeProposal {
        address proposer;
        address target;
        bool isAdd;
        uint256 timestamp;
        uint256 confirmationCount;
        bool executed;
        mapping(address => bool) confirmations;
    }

    struct RecoveryRequest {
        address newOwner;
        uint256 timestamp;
        uint256 confirmationCount;
        bool executed;
        mapping(address => bool) guardianConfirmations;
    }

    struct PauseProposal {
        bool isPause;
        uint256 timestamp;
        uint256 confirmationCount;
        bool executed;
        mapping(address => bool) confirmations;
    }

    // Storage for proposals
    mapping(uint256 => OwnerChangeProposal) public ownerChangeProposals;
    mapping(bytes32 => RecoveryRequest) public recoveryRequests;
    mapping(uint256 => PauseProposal) public pauseProposals;

    // Events
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event ThresholdUpdated(uint256 newThreshold);
    event Initialized(address[] owners, uint256 threshold);
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event PartitionSet(address indexed token, bytes32 partition);
    event Deposit(address indexed user, address indexed token, uint256 amount, uint256 tokenId);
    event Transfer(address indexed from, address indexed to, address indexed token, uint256 amount, uint256 tokenId);
    event WithdrawalRequested(uint256 indexed requestId, address indexed user, address indexed token, uint256 amount, uint256 tokenId, address to, bytes32 partition);
    event WithdrawalApproved(uint256 indexed requestId, address indexed approver);
    event WithdrawalExecuted(uint256 indexed requestId, address indexed to, address indexed token, uint256 amount, uint256 tokenId, bytes32 partition);
    event AuditLogCreated(uint256 indexed logId, address indexed actor, string action, bytes32 dataHash);
    event EmergencyPause();
    event EmergencyUnpause();
    event OwnerChangeProposed(uint256 indexed proposalId, address indexed proposer, address indexed target, bool isAdd);
    event OwnerChangeConfirmed(uint256 indexed proposalId, address indexed confirmer);
    event OwnerChangeExecuted(uint256 indexed proposalId, address indexed target, bool isAdd);
    event GuardianAdded(address indexed guardian);
    event GuardianRemoved(address indexed guardian);
    event GuardianThresholdUpdated(uint256 newThreshold);
    event RecoveryInitiated(bytes32 indexed recoveryId, address indexed newOwner);
    event RecoveryConfirmed(bytes32 indexed recoveryId, address indexed guardian);
    event RecoveryExecuted(bytes32 indexed recoveryId, address indexed newOwner);
    event AuditLogLevelUpdated(uint256 newLevel);
    event PauseProposed(uint256 indexed proposalId, bool isPause);
    event PauseConfirmed(uint256 indexed proposalId, address indexed confirmer);
    event PauseExecuted(uint256 indexed proposalId, bool isPause);

    function initialize(
        address _entryPoint,
        address[] memory _owners,
        uint256 _threshold,
        address[] memory _guardians,
        uint256 _guardianThreshold,
        uint256 _ownerChangeDelay,
        uint256 _auditLogLevel
    ) public initializer {
        if (_entryPoint == address(0)) revert InvalidAddress();
        if (_owners.length < MIN_OWNERS || _owners.length > MAX_OWNERS) revert InvalidOwnerCount();
        if (_threshold < 2 || _threshold > _owners.length) revert InvalidThreshold();
        if (_guardians.length < 2 || _guardians.length > 5) revert InvalidOwnerCount();
        if (_guardianThreshold < 2 || _guardianThreshold > _guardians.length) revert InvalidThreshold();
        for (uint256 i = 0; i < _owners.length; i++) {
            if (_owners[i] == address(0)) revert InvalidAddress();
            if (ownerIndices[_owners[i]] != 0) revert DuplicateOwner();
            ownerIndices[_owners[i]] = i + 1;
            owners.push(_owners[i]);
        }
        for (uint256 i = 0; i < _guardians.length; i++) {
            if (_guardians[i] == address(0)) revert InvalidAddress();
            if (guardianIndices[_guardians[i]] != 0) revert DuplicateOwner();
            guardianIndices[_guardians[i]] = i + 1;
            guardians.push(_guardians[i]);
        }

        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        entryPoint = _entryPoint;
        threshold = _threshold;
        guardianThreshold = _guardianThreshold;
        ownerChangeDelay = _ownerChangeDelay;
        auditLogLevel = _auditLogLevel;
        isInitialized = true;
        _logAudit("Initialize", keccak256(abi.encode(_entryPoint, _owners, _threshold, _guardians, _guardianThreshold, _ownerChangeDelay, _auditLogLevel)), 1);
        emit Initialized(_owners, _threshold);
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        if (ownerIndices[msg.sender] == 0) revert NotOwner();
    }

    // Modifiers
    modifier onlyOwner() {
        if (ownerIndices[msg.sender] == 0) revert NotOwner();
        _;
    }

    modifier onlyEntryPoint() {
        if (msg.sender != entryPoint) revert NotEntryPoint();
        _;
    }

    modifier whenInitialized() {
        if (!isInitialized) revert NotInitialized();
        _;
    }

    modifier onlyGuardian() {
        if (guardianIndices[msg.sender] == 0) revert NotGuardian();
        _;
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 /*missingAccountFunds*/
    ) external onlyEntryPoint whenInitialized returns (uint256 validationData) {
        bytes memory signatures = userOp.signature;
        if (signatures.length < 65 * threshold) revert InvalidSignatureLength();

        bytes32 ethSignedHash = userOpHash.toEthSignedMessageHash();
        address[] memory signers = new address[](threshold);
        uint256 validCount = 0;

        for (uint256 i = 0; i < threshold && (i * 65) < signatures.length; i++) {
            bytes memory sig = new bytes(65);
            for (uint256 j = 0; j < 65; j++) {
                sig[j] = signatures[i * 65 + j];
            }
            address signer = ethSignedHash.recover(sig);
            if (ownerIndices[signer] == 0) continue;
            for (uint256 j = 0; j < validCount; j++) {
                if (signers[j] == signer) revert DuplicateOwner();
            }
            signers[validCount] = signer;
            validCount++;
        }

        if (validCount < threshold) revert InsufficientSignatures();
        _logAudit("ValidateUserOp", userOpHash, 1);
        return 0;
    }

    function proposeAddOwner(address newOwner) external onlyOwner whenInitialized nonReentrant {
        if (newOwner == address(0)) revert InvalidAddress();
        if (ownerIndices[newOwner] != 0) revert OwnerExists();
        if (owners.length >= MAX_OWNERS) revert MaxOwnersReached();

        OwnerChangeProposal storage proposal = ownerChangeProposals[proposalCount];
        proposal.proposer = msg.sender;
        proposal.target = newOwner;
        proposal.isAdd = true;
        proposal.timestamp = block.timestamp;
        proposal.confirmationCount = 1;
        proposal.executed = false;
        proposal.confirmations[msg.sender] = true;

        emit OwnerChangeProposed(proposalCount, msg.sender, newOwner, true);
        _logAudit("ProposeAddOwner", keccak256(abi.encode(proposalCount, newOwner)), 1);
        proposalCount++;
    }

    function proposeRemoveOwner(address ownerToRemove) external onlyOwner whenInitialized nonReentrant {
        if (ownerIndices[ownerToRemove] == 0) revert NotOwner();
        if (owners.length <= threshold) revert BelowThreshold();
        if (owners.length <= MIN_OWNERS) revert MinOwnersReached();

        OwnerChangeProposal storage proposal = ownerChangeProposals[proposalCount];
        proposal.proposer = msg.sender;
        proposal.target = ownerToRemove;
        proposal.isAdd = false;
        proposal.timestamp = block.timestamp;
        proposal.confirmationCount = 1;
        proposal.executed = false;
        proposal.confirmations[msg.sender] = true;

        emit OwnerChangeProposed(proposalCount, msg.sender, ownerToRemove, false);
        _logAudit("ProposeRemoveOwner", keccak256(abi.encode(proposalCount, ownerToRemove)), 1);
        proposalCount++;
    }

    function confirmOwnerChange(uint256 proposalId) external onlyOwner whenInitialized nonReentrant {
        OwnerChangeProposal storage proposal = ownerChangeProposals[proposalId];
        if (proposal.proposer == address(0)) revert ProposalNotFound();
        if (proposal.executed) revert AlreadyExecuted();
        if (block.timestamp > proposal.timestamp + ownerChangeDelay) revert ProposalExpired();
        if (proposal.confirmations[msg.sender]) revert AlreadyApproved();
        proposal.confirmations[msg.sender] = true;
        proposal.confirmationCount++;
        emit OwnerChangeConfirmed(proposalId, msg.sender);
        _logAudit("ConfirmOwnerChange", keccak256(abi.encode(proposalId, msg.sender)), 1);
    }

    function executeOwnerChange(uint256 proposalId) external onlyOwner whenInitialized nonReentrant {
        OwnerChangeProposal storage proposal = ownerChangeProposals[proposalId];
        if (proposal.proposer == address(0)) revert ProposalNotFound();
        if (proposal.executed) revert AlreadyExecuted();
        if (block.timestamp > proposal.timestamp + ownerChangeDelay) revert ProposalExpired();
        if (proposal.confirmationCount < threshold) revert ProposalNotConfirmed();
        proposal.executed = true;
        if (proposal.isAdd) {
            owners.push(proposal.target);
            ownerIndices[proposal.target] = owners.length;
            emit OwnerAdded(proposal.target);
            _logAudit("ExecuteAddOwner", keccak256(abi.encode(proposalId, proposal.target)), 1);
        } else {
            uint256 index = ownerIndices[proposal.target] - 1;
            owners[index] = owners[owners.length - 1];
            ownerIndices[owners[index]] = index + 1;
            owners.pop();
            delete ownerIndices[proposal.target];
            emit OwnerRemoved(proposal.target);
            _logAudit("ExecuteRemoveOwner", keccak256(abi.encode(proposalId, proposal.target)), 1);
        }
        emit OwnerChangeExecuted(proposalId, proposal.target, proposal.isAdd);
    }

    function updateThreshold(uint256 newThreshold) external onlyOwner whenInitialized nonReentrant {
        if (newThreshold < 2 || newThreshold > owners.length) revert InvalidThreshold();
        threshold = newThreshold;
        _logAudit("UpdateThreshold", keccak256(abi.encode(newThreshold)), 1);
        emit ThresholdUpdated(newThreshold);
    }

    function addGuardian(address newGuardian) external onlyOwner whenInitialized nonReentrant {
        if (newGuardian == address(0)) revert InvalidAddress();
        if (guardianIndices[newGuardian] != 0) revert OwnerExists();
        if (guardians.length >= 5) revert MaxOwnersReached();
        guardians.push(newGuardian);
        guardianIndices[newGuardian] = guardians.length;
        _logAudit("AddGuardian", keccak256(abi.encode(newGuardian)), 1);
        emit GuardianAdded(newGuardian);
    }

    function removeGuardian(address guardianToRemove) external onlyOwner whenInitialized nonReentrant {
        if (guardianIndices[guardianToRemove] == 0) revert NotGuardian();
        if (guardians.length <= 2) revert MinOwnersReached();
        uint256 index = guardianIndices[guardianToRemove] - 1;
        guardians[index] = guardians[guardians.length - 1];
        guardianIndices[guardians[index]] = index + 1;
        guardians.pop();
        delete guardianIndices[guardianToRemove];
        _logAudit("RemoveGuardian", keccak256(abi.encode(guardianToRemove)), 1);
        emit GuardianRemoved(guardianToRemove);
    }

    function updateGuardianThreshold(uint256 newThreshold) external onlyOwner whenInitialized nonReentrant {
        if (newThreshold < 2 || newThreshold > guardians.length) revert InvalidThreshold();
        guardianThreshold = newThreshold;
        _logAudit("UpdateGuardianThreshold", keccak256(abi.encode(newThreshold)), 1);
        emit GuardianThresholdUpdated(newThreshold);
    }

    function initiateRecovery(address newOwner, bytes memory signature) external whenInitialized nonReentrant {
        if (newOwner == address(0)) revert InvalidAddress();
        bytes32 recoveryId = keccak256(abi.encode(newOwner, block.timestamp));
        address signer = keccak256(abi.encodePacked(recoveryId)).toEthSignedMessageHash().recover(signature);
        if (ownerIndices[signer] == 0 && guardianIndices[signer] == 0) revert NotOwner();

        RecoveryRequest storage request = recoveryRequests[recoveryId];
        request.newOwner = newOwner;
        request.timestamp = block.timestamp;
        request.confirmationCount = 0;
        request.executed = false;

        _logAudit("InitiateRecovery", keccak256(abi.encode(recoveryId, newOwner)), 1);
        emit RecoveryInitiated(recoveryId, newOwner);
    }

    function confirmRecovery(bytes32 recoveryId) external onlyGuardian whenInitialized nonReentrant {
        RecoveryRequest storage request = recoveryRequests[recoveryId];
        if (request.newOwner == address(0)) revert RecoveryNotInitiated();
        if (request.executed) revert AlreadyExecuted();
        if (request.guardianConfirmations[msg.sender]) revert AlreadyApproved();
        request.guardianConfirmations[msg.sender] = true;
        request.confirmationCount++;
        _logAudit("ConfirmRecovery", keccak256(abi.encode(recoveryId, msg.sender)), 1);
        emit RecoveryConfirmed(recoveryId, msg.sender);
    }

    function executeRecovery(bytes32 recoveryId) external onlyGuardian whenInitialized nonReentrant {
        RecoveryRequest storage request = recoveryRequests[recoveryId];
        if (request.newOwner == address(0)) revert RecoveryNotInitiated();
        if (request.executed) revert AlreadyExecuted();
        if (request.confirmationCount < guardianThreshold) revert RecoveryNotConfirmed();
        request.executed = true;
        for (uint256 i = 0; i < owners.length; i++) {
            delete ownerIndices[owners[i]];
        }
        owners = new address[](1);
        owners[0] = request.newOwner;
        ownerIndices[request.newOwner] = 1;
        threshold = 1;
        _logAudit("ExecuteRecovery", keccak256(abi.encode(recoveryId, request.newOwner)), 1);
        emit RecoveryExecuted(recoveryId, request.newOwner);
    }

    function setAuditLogLevel(uint256 newLevel) external onlyOwner whenInitialized nonReentrant {
        if (newLevel > 2) revert InvalidThreshold();
        auditLogLevel = newLevel;
        _logAudit("SetAuditLogLevel", keccak256(abi.encode(newLevel)), 1);
        emit AuditLogLevelUpdated(newLevel);
    }

    function addToken(address token) external onlyOwner whenInitialized {
        if (token == address(0)) revert InvalidAddress();
        if (supportedTokens[token]) revert TokenNotSupported();
        supportedTokens[token] = true;
        _logAudit("AddToken", keccak256(abi.encode(token)), 1);
        emit TokenAdded(token);
    }

    function removeToken(address token) external onlyOwner whenInitialized {
        if (!supportedTokens[token]) revert TokenNotSupported();
        supportedTokens[token] = false;
        _logAudit("RemoveToken", keccak256(abi.encode(token)), 1);
        emit TokenRemoved(token);
    }

    function setPartition(address token, bytes32 partition) external onlyOwner whenInitialized {
        if (!supportedTokens[token]) revert TokenNotSupported();
        if (partition == bytes32(0) || !IERC3643(token).isValid(address(this), partition, 0, "")) revert InvalidPartition();
        tokenPartitions[token] = partition;
        _logAudit("SetPartition", keccak256(abi.encode(token, partition)), 1);
        emit PartitionSet(token, partition);
    }

    function depositETH() external payable whenNotPaused whenInitialized {
        balances[address(0)][msg.sender] += msg.value;
        _logAudit("DepositETH", keccak256(abi.encode(msg.sender, msg.value)), 2);
        emit Deposit(msg.sender, address(0), msg.value, 0);
    }

    function depositToken(address token, uint256 amount) external whenNotPaused whenInitialized {
        if (!supportedTokens[token]) revert TokenNotSupported();
        (bool success,) = token.call{gas: TRANSFER_GAS_LIMIT}(abi.encodeWithSelector(IERC20.safeTransferFrom.selector, msg.sender, address(this), amount));
        if (!success) revert("Token transfer failed");
        balances[token][msg.sender] += amount;
        _logAudit("DepositToken", keccak256(abi.encode(msg.sender, token, amount)), 2);
        emit Deposit(msg.sender, token, amount, 0);
    }

    function depositNFT(address token, uint256 tokenId) external whenNotPaused whenInitialized {
        if (!supportedTokens[token]) revert TokenNotSupported();
        (bool success,) = token.call{gas: TRANSFER_GAS_LIMIT}(abi.encodeWithSelector(IERC721.safeTransferFrom.selector, msg.sender, address(this), tokenId));
        if (!success) revert("NFT transfer failed");
        nftBalances[token][msg.sender][tokenId] = 1;
        _logAudit("DepositNFT", keccak256(abi.encode(msg.sender, token, tokenId)), 2);
        emit Deposit(msg.sender, token, 1, tokenId);
    }

    function depositERC1155(address token, uint256 tokenId, uint256 amount) external whenNotPaused whenInitialized {
        if (!supportedTokens[token]) revert TokenNotSupported();
        (bool success,) = token.call{gas: TRANSFER_GAS_LIMIT}(abi.encodeWithSelector(IERC1155.safeTransferFrom.selector, msg.sender, address(this), tokenId, amount, ""));
        if (!success) revert("ERC1155 transfer failed");
        nftBalances[token][msg.sender][tokenId] += amount;
        _logAudit("DepositERC1155", keccak256(abi.encode(msg.sender, token, tokenId, amount)), 2);
        emit Deposit(msg.sender, token, amount, tokenId);
    }

    function requestWithdrawal(address token, uint256 amount, address to) external whenNotPaused whenInitialized {
        if (balances[token][msg.sender] < amount) revert InsufficientBalance();
        if (to == address(0)) revert InvalidDestination();
        withdrawalRequests[requestCount] = WithdrawalRequest(msg.sender, token, amount, 0, to, false, false, bytes32(0));
        _logAudit("RequestWithdrawal", keccak256(abi.encode(requestCount, msg.sender, token, amount, to)), 2);
        emit WithdrawalRequested(requestCount, msg.sender, token, amount, 0, to, bytes32(0));
        requestCount++;
    }

    function requestNFTWithdrawal(address token, uint256 tokenId, uint256 amount, address to) external whenNotPaused whenInitialized {
        if (nftBalances[token][msg.sender][tokenId] < amount) revert InsufficientBalance();
        if (to == address(0)) revert InvalidDestination();
        withdrawalRequests[requestCount] = WithdrawalRequest(msg.sender, token, amount, tokenId, to, false, false, bytes32(0));
        _logAudit("RequestNFTWithdrawal", keccak256(abi.encode(requestCount, msg.sender, token, tokenId, amount, to)), 2);
        emit WithdrawalRequested(requestCount, msg.sender, token, amount, tokenId, to, bytes32(0));
        requestCount++;
    }

    function requestERC3643Withdrawal(address token, uint256 amount, address to, bytes32 partition) external whenNotPaused whenInitialized {
        if (balances[token][msg.sender] < amount) revert InsufficientBalance();
        if (to == address(0)) revert InvalidDestination();
        if (partition == bytes32(0) || !IERC3643(token).isValid(address(this), partition, amount, "")) revert InvalidPartition();
        withdrawalRequests[requestCount] = WithdrawalRequest(msg.sender, token, amount, 0, to, false, false, partition);
        _logAudit("RequestERC3643Withdrawal", keccak256(abi.encode(requestCount, msg.sender, token, amount, to, partition)), 2);
        emit WithdrawalRequested(requestCount, msg.sender, token, amount, 0, to, partition);
        requestCount++;
    }

    function approveWithdrawal(uint256 requestId) external onlyOwner whenNotPaused {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        if (req.approved) revert AlreadyApproved();
        req.approved = true;
        _logAudit("ApproveWithdrawal", keccak256(abi.encode(requestId)), 1);
        emit WithdrawalApproved(requestId, msg.sender);
    }

    function executeWithdrawal(uint256 requestId) external onlyOwner whenNotPaused nonReentrant {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        if (!req.approved) revert NotApproved();
        if (req.executed) revert AlreadyExecuted();
        if (balances[req.token][req.user] < req.amount) revert InsufficientBalance();
        req.executed = true;
        if (req.token == address(0)) {
            (bool success,) = req.to.call{gas: TRANSFER_GAS_LIMIT, value: req.amount}("");
            if (!success) revert("ETH transfer failed");
        } else {
            (bool success,) = req.token.call{gas: TRANSFER_GAS_LIMIT}(abi.encodeWithSelector(IERC20.safeTransfer.selector, req.to, req.amount));
            if (!success) revert("Token transfer failed");
        }
        balances[req.token][req.user] -= req.amount;
        _logAudit("ExecuteWithdrawal", keccak256(abi.encode(requestId, req.to, req.token, req.amount)), 1);
        emit WithdrawalExecuted(requestId, req.to, req.token, req.amount, 0, bytes32(0));
    }

    function executeNFTWithdrawal(uint256 requestId) external onlyOwner whenNotPaused nonReentrant {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        if (!req.approved) revert NotApproved();
        if (req.executed) revert AlreadyExecuted();
        if (nftBalances[req.token][req.user][req.tokenId] < req.amount) revert InsufficientBalance();
        req.executed = true;
        if (req.amount == 1 && req.tokenId != 0) {
            (bool success,) = req.token.call{gas: TRANSFER_GAS_LIMIT}(abi.encodeWithSelector(IERC721.safeTransferFrom.selector, address(this), req.to, req.tokenId));
            if (!success) revert("NFT transfer failed");
        } else {
            (bool success,) = req.token.call{gas: TRANSFER_GAS_LIMIT}(abi.encodeWithSelector(IERC1155.safeTransferFrom.selector, address(this), req.to, req.tokenId, req.amount, ""));
            if (!success) revert("ERC1155 transfer failed");
        }
        nftBalances[req.token][req.user][req.tokenId] -= req.amount;
        _logAudit("ExecuteNFTWithdrawal", keccak256(abi.encode(requestId, req.to, req.token, req.amount, req.tokenId)), 1);
        emit WithdrawalExecuted(requestId, req.to, req.token, req.amount, req.tokenId, bytes32(0));
    }

    function executeERC3643Withdrawal(uint256 requestId, bytes calldata data) external onlyOwner whenNotPaused nonReentrant {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        if (!req.approved) revert NotApproved();
        if (req.executed) revert AlreadyExecuted();
        if (balances[req.token][req.user] < req.amount) revert InsufficientBalance();
        if (req.partition == bytes32(0)) revert InvalidPartition();
        req.executed = true;
        (bool success,) = req.token.call{gas: TRANSFER_GAS_LIMIT}(abi.encodeWithSelector(IERC3643.transferFrom.selector, address(this), req.to, req.amount, req.partition, data));
        if (!success) revert("ERC3643 transfer failed");
        balances[req.token][req.user] -= req.amount;
        _logAudit("ExecuteERC3643Withdrawal", keccak256(abi.encode(requestId, req.to, req.token, req.amount, req.partition)), 1);
        emit WithdrawalExecuted(requestId, req.to, req.token, req.amount, 0, req.partition);
    }

    function transfer(address to, address token, uint256 amount, uint256 tokenId) external onlyOwner whenNotPaused whenInitialized {
        if (to == address(0)) revert InvalidDestination();
        if (tokenId == 0) {
            if (balances[token][msg.sender] < amount) revert InsufficientBalance();
            balances[token][msg.sender] -= amount;
            balances[token][to] += amount;
        } else {
            if (nftBalances[token][msg.sender][tokenId] < amount) revert InsufficientBalance();
            nftBalances[token][msg.sender][tokenId] -= amount;
            nftBalances[token][to][tokenId] += amount;
        }
        _logAudit("Transfer", keccak256(abi.encode(msg.sender, to, token, amount, tokenId)), 2);
        emit Transfer(msg.sender, to, token, amount, tokenId);
    }

    function proposePause(bool isPause) external onlyOwner whenInitialized nonReentrant {
        PauseProposal storage proposal = pauseProposals[pauseProposalCount];
        proposal.isPause = isPause;
        proposal.timestamp = block.timestamp;
        proposal.confirmationCount = 1;
        proposal.executed = false;
        proposal.confirmations[msg.sender] = true;

        emit PauseProposed(pauseProposalCount, isPause);
        _logAudit(isPause ? "ProposePause" : "ProposeUnpause", keccak256(abi.encode(pauseProposalCount, isPause)), 1);
        pauseProposalCount++;
    }

    function confirmPause(uint256 proposalId) external onlyOwner whenInitialized nonReentrant {
        PauseProposal storage proposal = pauseProposals[proposalId];
        if (proposal.timestamp == 0) revert ProposalNotFound();
        if (proposal.executed) revert AlreadyExecuted();
        if (proposal.confirmations[msg.sender]) revert AlreadyApproved();
        proposal.confirmations[msg.sender] = true;
        proposal.confirmationCount++;
        emit PauseConfirmed(proposalId, msg.sender);
        _logAudit("ConfirmPause", keccak256(abi.encode(proposalId, msg.sender)), 1);
    }

    function executePause(uint256 proposalId) external onlyOwner whenInitialized nonReentrant {
        PauseProposal storage proposal = pauseProposals[proposalId];
        if (proposal.timestamp == 0) revert ProposalNotFound();
        if (proposal.executed) revert AlreadyExecuted();
        if (proposal.confirmationCount < threshold) revert ProposalNotConfirmed();
        proposal.executed = true;
        if (proposal.isPause) {
            _pause();
            emit EmergencyPause();
            _logAudit("ExecutePause", keccak256(abi.encode(proposalId)), 1);
        } else {
            _unpause();
            emit EmergencyUnpause();
            _logAudit("ExecuteUnpause", keccak256(abi.encode(proposalId)), 1);
        }
        emit PauseExecuted(proposalId, proposal.isPause);
    }

    function _logAudit(string memory action, bytes32 dataHash, uint256 requiredLevel) internal {
        if (auditLogLevel >= requiredLevel) {
            auditLogs[auditLogCount] = AuditLog(msg.sender, action, block.timestamp, dataHash);
            emit AuditLogCreated(auditLogCount, msg.sender, action, dataHash);
            auditLogCount++;
        }
    }

    function getBalance(address token, address user) external view returns (uint256) {
        return balances[token][user];
    }

    function getNFTBalance(address token, address user, uint256 tokenId) external view returns (uint256) {
        return nftBalances[token][user][tokenId];
    }

    function getWithdrawalRequest(uint256 requestId) external view returns (
        address user,
        address token,
        uint256 amount,
        uint256 tokenId,
        address to,
        bool approved,
        bool executed,
        bytes32 partition
    ) {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        return (req.user, req.token, req.amount, req.tokenId, req.to, req.approved, req.executed, req.partition);
    }

    function getAuditLog(uint256 logId) external view returns (address actor, string memory action, uint256 timestamp, bytes32 dataHash) {
        AuditLog storage log = auditLogs[logId];
        return (log.actor, log.action, log.timestamp, log.dataHash);
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}