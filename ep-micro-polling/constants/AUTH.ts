export const AUTH = {
    SECRET_KEY: "EP_2024",
    ENFORCE_ONLY_ONE_SESSION: process.env.INIT_COMMON_ENFORCE_ONLY_ONE_SESSION,
    API: {
       PUBLIC: [
         "/api/v1/admin/health",
         "/api/v1/admin/passwordPolicies/add",
         "/api/v1/admin/passwordPolicies/update",
         "/api/v1/admin/passwordPolicies/list",
         "/api/v1/admin/passwordPolicies/:passwordPolicyId"
       ]
    }
}
