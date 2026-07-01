const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")


const router = express.Router()



/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)


/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController)

/**
 * - GET /api/accounts/details/:accountId
 * - Get details of a specific account by ID
 * - Protected Route
 */

router.get(
  "/details/:accountId",
  authMiddleware.authMiddleware,
  accountController.getAccountDetailsController
)

/**
 * - PATCH /api/accounts/freeze/:accountId
 * - Freeze an account (prevent transactions)
 * - Protected Route
 */
router.patch(
  "/freeze/:accountId",
  authMiddleware.authMiddleware,
  accountController.freezeAccountController
)
/** * - PATCH /api/accounts/unfreeze/:accountId
 * - Unfreeze an account (allow transactions)
 * - Protected Route
 */

router.patch(
  "/unfreeze/:accountId",
  authMiddleware.authMiddleware,
  accountController.unfreezeAccountController
)

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)

module.exports = router