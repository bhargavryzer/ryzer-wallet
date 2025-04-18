// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

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
    function isPartitionValid(address token, bytes32 partition) external view returns (bool);
}

contract RyzerCustodialWallet is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable, IERC721Receiver, IERC1155Receiver {
    // Custom errors
    error InvalidAddress();
    error TokenNotSupported();
    error InsufficientBalance();
    error InvalidDestination();
    error AccountFrozen();
    error NotKYCVerified();
    error AlreadyApproved();
    error AlreadyExecuted();
    error NotApproved();
    error InvalidPartition();
    error TimelockNotElapsed();
    error InvalidBatchLength();
    error EmergencyWithdrawNotAllowed();
    error ArraysLengthMismatch();

    // State Variables
    address public custodian;
    mapping(address => mapping(address => uint256)) public balances;
    mapping(address => mapping(address => mapping(uint256 => uint256))) public nftBalances;
    mapping(uint256 => WithdrawalRequest) public withdrawalRequests;
    uint256 public requestCount;
    mapping(address => bool) public supportedTokens;
    mapping(address => bool) public frozenAccounts;
    uint256 public withdrawalFee;
    mapping(address => bytes32) public tokenPartitions;
    mapping(address => bool) public kycVerified;
    uint256 public withdrawalDelay;
    address public emergencyRecoveryAddress;
    uint256 public emergencyWithdrawDelay;
    uint256 public lastEmergencyWithdrawRequest;

    struct WithdrawalRequest {
        address user;
        address token;
        uint256 amount;
        uint256 tokenId;
        address to;
        bool approved;
        bool executed;
        bytes32 partition;
        uint256 requestTimestamp;
    }

    // Events
    event Deposit(address indexed user, address indexed token, uint256 amount, uint256 tokenId);
    event WithdrawalRequested(uint256 indexed requestId, address indexed user, address indexed token, uint256 amount, uint256 tokenId, address to, bytes32 partition);
    event WithdrawalApproved(uint256 indexed requestId, address indexed approver);
    event WithdrawalExecuted(uint256 indexed requestId, address indexed to, address indexed token, uint256 amount, uint256 tokenId, bytes32 partition);
    event Transfer(address indexed from, address indexed to, address indexed token, uint256 amount, uint256 tokenId);
    event CustodianUpdated(address indexed oldCustodian, address indexed newCustodian);
    event AccountUnfrozen(address indexed user);
    event WithdrawalFeeUpdated(uint256 oldFee, uint256 newFee);
    event PartitionSet(address indexed token, bytes32 partition);
    event KYCUpdated(address indexed user, bool verified);
    event EmergencyPause();
    event EmergencyUnpause();
    event WithdrawalDelayUpdated(uint256 oldDelay, uint256 newDelay);
    event EmergencyWithdrawRequested(address indexed to, uint256 timestamp);
    event EmergencyWithdrawExecuted(address indexed to, address indexed token, uint256 amount, uint256 tokenId);
    event EmergencyRecoveryAddressUpdated(address indexed oldAddress, address indexed newAddress);

    function initialize(address _custodian, address _emergencyRecoveryAddress, uint256 _withdrawalDelay, uint256 _emergencyWithdrawDelay) public initializer {
        if (_custodian == address(0) || _emergencyRecoveryAddress == address(0)) revert InvalidAddress();
        __Ownable_init(_custodian);
        __ReentrancyGuard_init();
        __Pausable_init();
        custodian = _custodian;
        withdrawalFee = 0;
        withdrawalDelay = _withdrawalDelay;
        emergencyRecoveryAddress = _emergencyRecoveryAddress;
        emergencyWithdrawDelay = _emergencyWithdrawDelay;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return
            interfaceId == type(IERC721Receiver).interfaceId ||
            interfaceId == type(IERC1155Receiver).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    // Modifiers
    modifier onlyCustodian() {
        require(msg.sender == custodian, "Only custodian");
        _;
    }

    modifier notFrozen(address user) {
        if (frozenAccounts[user]) revert AccountFrozen();
        _;
    }

    modifier onlyKYCVerified(address user) {
        if (!kycVerified[user]) revert NotKYCVerified();
        _;
    }

    // Administrative Functions
    function pause() external onlyCustodian {
        _pause();
        emit EmergencyPause();
    }

    function unpause() external onlyCustodian {
        _unpause();
        emit EmergencyUnpause();
    }

    function updateCustodian(address newCustodian) external onlyOwner {
        if (newCustodian == address(0)) revert InvalidAddress();
        address oldCustodian = custodian;
        custodian = newCustodian;
        emit CustodianUpdated(oldCustodian, newCustodian);
    }

    function addToken(address token) external onlyCustodian {
        if (token == address(0)) revert InvalidAddress();
        if (supportedTokens[token]) revert TokenNotSupported();
        supportedTokens[token] = true;
    }

    function removeToken(address token) external onlyCustodian {
        if (!supportedTokens[token]) revert TokenNotSupported();
        supportedTokens[token] = false;
    }

    function setPartition(address token, bytes32 partition) external onlyCustodian {
        if (!supportedTokens[token]) revert TokenNotSupported();
        if (partition == bytes32(0) || !IERC3643(token).isPartitionValid(token, partition)) revert InvalidPartition();
        tokenPartitions[token] = partition;
        emit PartitionSet(token, partition);
    }

    function updateWithdrawalFee(uint256 newFee) external onlyCustodian {
        uint256 oldFee = withdrawalFee;
        withdrawalFee = newFee;
        emit WithdrawalFeeUpdated(oldFee, newFee);
    }

    function updateWithdrawalDelay(uint256 newDelay) external onlyCustodian {
        uint256 oldDelay = withdrawalDelay;
        withdrawalDelay = newDelay;
        emit WithdrawalDelayUpdated(oldDelay, newDelay);
    }

    function updateEmergencyRecoveryAddress(address newAddress) external onlyOwner {
        if (newAddress == address(0)) revert InvalidAddress();
        address oldAddress = emergencyRecoveryAddress;
        emergencyRecoveryAddress = newAddress;
        emit EmergencyRecoveryAddressUpdated(oldAddress, newAddress);
    }

    function freezeAccount(address user) external onlyCustodian {
        if (frozenAccounts[user]) revert AccountFrozen();
        frozenAccounts[user] = true;
    }

    function unfreezeAccount(address user) external onlyCustodian {
        if (!frozenAccounts[user]) revert AccountFrozen();
        frozenAccounts[user] = false;
        emit AccountUnfrozen(user);
    }

    function updateKYCStatus(address user, bool verified) external onlyCustodian {
        kycVerified[user] = verified;
        emit KYCUpdated(user, verified);
    }

    // Deposit Functions
    function depositETH() external payable whenNotPaused notFrozen(msg.sender) onlyKYCVerified(msg.sender) {
        balances[address(0)][msg.sender] += msg.value;
        emit Deposit(msg.sender, address(0), msg.value, 0);
    }

    function depositToken(address token, uint256 amount) external whenNotPaused notFrozen(msg.sender) onlyKYCVerified(msg.sender) {
        if (!supportedTokens[token]) revert TokenNotSupported();
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        balances[token][msg.sender] += amount;
        emit Deposit(msg.sender, token, amount, 0);
    }

    function depositNFT(address token, uint256 tokenId) external whenNotPaused notFrozen(msg.sender) onlyKYCVerified(msg.sender) {
        if (!supportedTokens[token]) revert TokenNotSupported();
        IERC721(token).safeTransferFrom(msg.sender, address(this), tokenId);
        nftBalances[token][msg.sender][tokenId] = 1;
        emit Deposit(msg.sender, token, 1, tokenId);
    }

    function depositERC1155(address token, uint256 tokenId, uint256 amount) external whenNotPaused notFrozen(msg.sender) onlyKYCVerified(msg.sender) {
        if (!supportedTokens[token]) revert TokenNotSupported();
        IERC1155(token).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        nftBalances[token][msg.sender][tokenId] += amount;
        emit Deposit(msg.sender, token, amount, tokenId);
    }

    function batchDeposit(address[] calldata tokens, uint256[] calldata amounts, uint256[] calldata tokenIds) external whenNotPaused notFrozen(msg.sender) onlyKYCVerified(msg.sender) {
        if (tokens.length != amounts.length || tokens.length != tokenIds.length) revert ArraysLengthMismatch();
        for (uint256 i = 0; i < tokens.length; i++) {
            if (!supportedTokens[tokens[i]]) revert TokenNotSupported();
            if (tokenIds[i] == 0) {
                IERC20(tokens[i]).safeTransferFrom(msg.sender, address(this), amounts[i]);
                balances[tokens[i]][msg.sender] += amounts[i];
                emit Deposit(msg.sender, tokens[i], amounts[i], 0);
            } else {
                if (amounts[i] == 1) {
                    IERC721(tokens[i]).safeTransferFrom(msg.sender, address(this), tokenIds[i]);
                    nftBalances[tokens[i]][msg.sender][tokenIds[i]] = 1;
                } else {
                    IERC1155(tokens[i]).safeTransferFrom(msg.sender, address(this), tokenIds[i], amounts[i], "");
                    nftBalances[tokens[i]][msg.sender][tokenIds[i]] += amounts[i];
                }
                emit Deposit(msg.sender, tokens[i], amounts[i], tokenIds[i]);
            }
        }
    }

    // Withdrawal Request Functions
    function requestWithdrawal(address token, uint256 amount, address to) external whenNotPaused notFrozen(msg.sender) onlyKYCVerified(msg.sender) {
        if (balances[token][msg.sender] < amount) revert InsufficientBalance();
        if (to == address(0)) revert InvalidDestination();
        withdrawalRequests[requestCount] = WithdrawalRequest(msg.sender, token, amount, 0, to, false, false, bytes32(0), block.timestamp);
        emit WithdrawalRequested(requestCount, msg.sender, token, amount, 0, to, bytes32(0));
        requestCount++;
    }

    function requestNFTWithdrawal(address token, uint256 tokenId, uint256 amount, address to) external whenNotPaused notFrozen(msg.sender) onlyKYCVerified(msg.sender) {
        if (nftBalances[token][msg.sender][tokenId] < amount) revert InsufficientBalance();
        if (to == address(0)) revert InvalidDestination();
        withdrawalRequests[requestCount] = WithdrawalRequest(msg.sender, token, amount, tokenId, to, false, false, bytes32(0), block.timestamp);
        emit WithdrawalRequested(requestCount, msg.sender, token, amount, tokenId, to, bytes32(0));
        requestCount++;
    }

    function requestERC3643Withdrawal(address token, uint256 amount, address to, bytes32 partition) external whenNotPaused notFrozen(msg.sender) onlyKYCVerified(msg.sender) {
        if (balances[token][msg.sender] < amount) revert InsufficientBalance();
        if (to == address(0)) revert InvalidDestination();
        if (partition == bytes32(0) || !IERC3643(token).isPartitionValid(token, partition)) revert InvalidPartition();
        withdrawalRequests[requestCount] = WithdrawalRequest(msg.sender, token, amount, 0, to, false, false, partition, block.timestamp);
        emit WithdrawalRequested(requestCount, msg.sender, token, amount, 0, to, partition);
        requestCount++;
    }

    function batchRequestWithdrawal(address[] calldata tokens, uint256[] calldata amounts, uint256[] calldata tokenIds, address[] calldata toAddresses) external whenNotPaused notFrozen(msg.sender) onlyKYCVerified(msg.sender) {
        if (tokens.length != amounts.length || tokens.length != tokenIds.length || tokens.length != toAddresses.length) revert ArraysLengthMismatch();
        for (uint256 i = 0; i < tokens.length; i++) {
            if (toAddresses[i] == address(0)) revert InvalidDestination();
            if (tokenIds[i] == 0) {
                if (balances[tokens[i]][msg.sender] < amounts[i]) revert InsufficientBalance();
                withdrawalRequests[requestCount] = WithdrawalRequest(msg.sender, tokens[i], amounts[i], 0, toAddresses[i], false, false, bytes32(0), block.timestamp);
                emit WithdrawalRequested(requestCount, msg.sender, tokens[i], amounts[i], 0, toAddresses[i], bytes32(0));
            } else {
                if (nftBalances[tokens[i]][msg.sender][tokenIds[i]] < amounts[i]) revert InsufficientBalance();
                withdrawalRequests[requestCount] = WithdrawalRequest(msg.sender, tokens[i], amounts[i], tokenIds[i], toAddresses[i], false, false, bytes32(0), block.timestamp);
                emit WithdrawalRequested(requestCount, msg.sender, tokens[i], amounts[i], tokenIds[i], toAddresses[i], bytes32(0));
            }
            requestCount++;
        }
    }

    // Withdrawal Execution Functions
    function approveWithdrawal(uint256 requestId) external onlyCustodian whenNotPaused {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        if (req.approved) revert AlreadyApproved();
        req.approved = true;
        emit WithdrawalApproved(requestId, msg.sender);
    }

    function executeWithdrawal(uint256 requestId) external onlyCustodian whenNotPaused nonReentrant {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        if (!req.approved) revert NotApproved();
        if (req.executed) revert AlreadyExecuted();
        if (block.timestamp < req.requestTimestamp + withdrawalDelay) revert TimelockNotElapsed();
        if (balances[req.token][req.user] < req.amount) revert InsufficientBalance();

        req.executed = true;
        uint256 amountAfterFee = req.amount;
        if (withdrawalFee > 0) {
            if (req.token == address(0) && address(this).balance < withdrawalFee) revert InsufficientBalance();
            amountAfterFee -= withdrawalFee;
            if (req.token == address(0)) {
                payable(custodian).transfer(withdrawalFee);
            } else {
                IERC20(req.token).safeTransfer(custodian, withdrawalFee);
            }
        }

        if (req.token == address(0)) {
            payable(req.to).transfer(amountAfterFee);
        } else {
            IERC20(req.token).safeTransfer(req.to, amountAfterFee);
        }
        balances[req.token][req.user] -= req.amount;
        emit WithdrawalExecuted(requestId, req.to, req.token, amountAfterFee, 0, bytes32(0));
    }

    function executeNFTWithdrawal(uint256 requestId) external onlyCustodian whenNotPaused nonReentrant {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        if (!req.approved) revert NotApproved();
        if (req.executed) revert AlreadyExecuted();
        if (block.timestamp < req.requestTimestamp + withdrawalDelay) revert TimelockNotElapsed();
        if (nftBalances[req.token][req.user][req.tokenId] < req.amount) revert InsufficientBalance();

        req.executed = true;
        if (withdrawalFee > 0 && req.token != address(0)) {
            IERC20(req.token).safeTransfer(custodian, withdrawalFee);
        }
        if (req.amount == 1 && req.tokenId != 0) {
            IERC721(req.token).safeTransferFrom(address(this), req.to, req.tokenId);
        } else {
            IERC1155(req.token).safeTransferFrom(address(this), req.to, req.tokenId, req.amount, "");
        }
        nftBalances[req.token][req.user][req.tokenId] -= req.amount;
        emit WithdrawalExecuted(requestId, req.to, req.token, req.amount, req.tokenId, bytes32(0));
    }

    function executeERC3643Withdrawal(uint256 requestId, bytes calldata data) external onlyCustodian whenNotPaused nonReentrant {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        if (!req.approved) revert NotApproved();
        if (req.executed) revert AlreadyExecuted();
        if (block.timestamp < req.requestTimestamp + withdrawalDelay) revert TimelockNotElapsed();
        if (balances[req.token][req.user] < req.amount) revert InsufficientBalance();
        if (req.partition == bytes32(0)) revert InvalidPartition();

        req.executed = true;
        if (withdrawalFee > 0) {
            IERC20(req.token).safeTransfer(custodian, withdrawalFee);
        }
        if (!IERC3643(req.token).transferFrom(address(this), req.to, req.amount, req.partition, data)) {
            revert("ERC3643 transfer failed");
        }
        balances[req.token][req.user] -= req.amount;
        emit WithdrawalExecuted(requestId, req.to, req.token, req.amount, 0, req.partition);
    }

    // Emergency Withdrawal
    function requestEmergencyWithdraw() external onlyOwner {
        lastEmergencyWithdrawRequest = block.timestamp;
        emit EmergencyWithdrawRequested(emergencyRecoveryAddress, block.timestamp);
    }

    function executeEmergencyWithdraw(address token, uint256 tokenId, uint256 amount) external onlyOwner nonReentrant {
        if (block.timestamp < lastEmergencyWithdrawRequest + emergencyWithdrawDelay) revert EmergencyWithdrawNotAllowed();
        if (tokenId == 0) {
            if (balances[token][address(this)] < amount) revert InsufficientBalance();
            balances[token][address(this)] -= amount;
            if (token == address(0)) {
                payable(emergencyRecoveryAddress).transfer(amount);
            } else {
                IERC20(token).safeTransfer(emergencyRecoveryAddress, amount);
            }
        } else {
            if (nftBalances[token][address(this)][tokenId] < amount) revert InsufficientBalance();
            nftBalances[token][address(this)][tokenId] -= amount;
            if (amount == 1) {
                IERC721(token).safeTransferFrom(address(this), emergencyRecoveryAddress, tokenId);
            } else {
                IERC1155(token).safeTransferFrom(address(this), emergencyRecoveryAddress, tokenId, amount, "");
            }
        }
        emit EmergencyWithdrawExecuted(emergencyRecoveryAddress, token, amount, tokenId);
    }

    // Transfer Functions
    function transfer(address from, address to, address token, uint256 amount) external onlyCustodian whenNotPaused {
        if (balances[token][from] < amount) revert InsufficientBalance();
        if (to == address(0)) revert InvalidDestination();
        balances[token][from] -= amount;
        balances[token][to] += amount;
        emit Transfer(from, to, token, amount, 0);
    }

    function transferNFT(address from, address to, address token, uint256 tokenId, uint256 amount) external onlyCustodian whenNotPaused {
        if (nftBalances[token][from][tokenId] < amount) revert InsufficientBalance();
        if (to == address(0)) revert InvalidDestination();
        nftBalances[token][from][tokenId] -= amount;
        nftBalances[token][to][tokenId] += amount;
        emit Transfer(from, to, token, amount, tokenId);
    }

    // View Functions
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
        bytes32 partition,
        uint256 requestTimestamp
    ) {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        return (req.user, req.token, req.amount, req.tokenId, req.to, req.approved, req.executed, req.partition, req.requestTimestamp);
    }

    // Token Receiver Functions
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