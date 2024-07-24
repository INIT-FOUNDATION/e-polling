export const AUTH = {
    SECRET_KEY: "EP_2024",
    ENFORCE_ONLY_ONE_SESSION: process.env.INIT_COMMON_ENFORCE_ONLY_ONE_SESSION,
    API: {
       PUBLIC: [
         "/api/v1/admin/health",
         "/api/v1/admin/departments/list",
         "/api/v1/admin/departments/add",
         "/api/v1/admin/departments/update",
         "/api/v1/admin/departments/:departmentId",
         "/api/v1/admin/departments/updateStatus",
         "/api/v1/admin/passwordPolicies/add",
         "/api/v1/admin/passwordPolicies/update",
         "/api/v1/admin/passwordPolicies/list",
         "/api/v1/admin/passwordPolicies/:passwordPolicyId"
       ]
    }
}
