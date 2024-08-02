export const ROLES = {
  ROLE00000: {
    errorCode: "ROLE0000",
    errorMessage: "Internal Server Error",
  },
  ROLE00001: {
    errorCode: "ROLE00001",
    errorMessage: "Invalid Role name length, It must be within 3 and 20",
  },
  ROLE00002: {
    errorCode: "ROLE00002",
    errorMessage: "Invalid Role Description length, It must be within 3 and 50",
  },
  ROLE00003: {
    errorCode: "ROLE00003",
    errorMessage: "Role Id Required!",
  },
  ROLE00004: {
    errorCode: "ROLE00004",
    errorMessage: "Invalid Role Status!",
  },
  ROLE00005: {
    errorCode: "ROLE00005",
    errorMessage: "User Id Required!",
  },
  ROLE00006: {
    errorCode: "ROLE00006",
    errorMessage: "Requested Role does not exists!",
  },
  ROLE00007: {
    errorCode: "ROLE00007",
    errorMessage: "Role with Requested Name already exists!",
  },
  ROLE00008: {
    errorCode: "ROLE00008",
    errorMessage: "Requested User does not exists!",
  },
  ROLE00009: {
    errorCode: "ROLE00009",
    errorMessage: "Level Required!",
  },
  ROLE00010: {
    errorCode: "ROLE00010",
    errorMessage: "Permissions are Required!",
  },
};

export const USERS = {
  USER00000: {
    errorCode: "USER00000",
    errorMessage: "Internal Server Error",
  },
  USER00001: {
    errorCode: "USER00001",
    errorMessage: "Invalid User name length, It must be within 3 and 20",
  },
  USER00002: {
    errorCode: "USER00002",
    errorMessage: "Invalid Display Name length, It must be within 3 and 20",
  },
  USER00003: {
    errorCode: "USER00003",
    errorMessage: "Invalid First Name length, It must be within 3 and 20",
  },
  USER00004: {
    errorCode: "USER00004",
    errorMessage: "Invalid Last Name length, It must be within 3 and 20",
  },
  USER00005: {
    errorCode: "USER00005",
    errorMessage: "User with Requested Mobile number already exists!",
  },
  USER00006: {
    errorCode: "USER00006",
    errorMessage: "User Id Required!",
  },
  USER00007: {
    errorCode: "USER00007",
    errorMessage: "Role Id Required!",
  },
  USER000011: {
    errorCode: "USER000011",
    errorMessage: "User with Requested Id does not exists!",
  },
  USER000012: {
    errorCode: "USER000012",
    errorMessage: "User Requested to report does not exists!",
  },
  USER000013: {
    errorCode: "USER000013",
    errorMessage: "Role Id Invalid!",
  },
  USER000014: {
    errorCode: "USER000014",
    errorMessage: "Invalid User Status!",
  },
};

export const PASSWORDPOLICIES = {
  PASSWORDPOLICIES000: {
    errorCode: "PASSWORDPOLICIES000",
    errorMessage: "Internal Server Error",
  },
  PASSWORDPOLICIES001: {
    errorCode: "PASSWORDPOLICIES001",
    errorMessage: "Requested Password Policy does not exists!",
  },
  PASSWORDPOLICIES002: {
    errorCode: "PASSWORDPOLICIES002",
    errorMessage: "Password Policy Id Required!",
  },
};

export const CATEGORIES = {
  CATEGORIES000: {
    errorCode: "CATEGORIES000",
    errorMessage: "Internal Server Error",
  },
  CATEGORIES001: {
    errorCode: "CATEGORIES001",
    errorMessage: "Requested Category does not exists!",
  },
  CATEGORIES002: {
    errorCode: "CATEGORIES002",
    errorMessage: "Category Id Required!",
  },
  CATEGORIES003: {
    errorCode: "CATEGORIES003",
    errorMessage: "Invalid Category Status!",
  },
  CATEGORIES004: {
    errorCode: "CATEGORIES004",
    errorMessage: "Invalid Category Id!",
  },
  CATEGORIES005: {
    errorCode: "CATEGORIES005",
    errorMessage: "Requested Category name already exists!",
  },
}

export const MENUS = {
  MENUS000: {
    errorCode: "MENUS000",
    errorMessage: "Internal Server Error",
  },
  MENUS001: {
    errorCode: "MENUS001",
    errorMessage: "Requested Menu does not exists!",
  },
  MENUS002: {
    errorCode: "MENUS002",
    errorMessage: "Menu Id Required!",
  },
  MENUS003: {
    errorCode: "MENUS003",
    errorMessage: "Invalid Menu Status!",
  },
  MENUS004: {
    errorCode: "MENUS004",
    errorMessage: "Invalid Menu Id!",
  },
  MENUS005: {
    errorCode: "MENUS005",
    errorMessage: "Requested Menu name already exists!",
  },
}

export const EVENTS = {
  EVENTS000: {
    errorCode: "EVENTS000",
    errorMessage: "Internal Server Error",
  },
  EVENTS001: {
    errorCode: "EVENTS001",
    errorMessage: "Requested Event does not exists!",
  },
  EVENTS002: {
    errorCode: "EVENTS002",
    errorMessage: "Event Id Required!",
  },
  EVENTS003: {
    errorCode: "EVENTS003",
    errorMessage: "Invalid Event Status!",
  },
  EVENTS004: {
    errorCode: "EVENTS004",
    errorMessage: "Invalid Event Id!",
  },
  EVENTS005: {
    errorCode: "EVENTS005",
    errorMessage: "Requested Event name already exists!",
  },
  EVENTS006: {
    errorCode: "EVENTS006",
    errorMessage: "Start time should be less than end time!",
  },
}

export const JUDGES = {
  JUDGES000: {
    errorCode: "JUDGES000",
    errorMessage: "Internal Server Error",
  },
  JUDGES001: {
    errorCode: "JUDGES001",
    errorMessage: "Requested Judge does not exists!",
  },
  JUDGES002: {
    errorCode: "JUDGES002",
    errorMessage: "Judge Id Required!",
  },
  JUDGES003: {
    errorCode: "JUDGES003",
    errorMessage: "Invalid Judge Status!",
  },
  JUDGES004: {
    errorCode: "JUDGES004",
    errorMessage: "Invalid Judge Id!",
  },
  JUDGES005: {
    errorCode: "JUDGES005",
    errorMessage: "Requested Judge name already exists!",
  },
  JUDGES006: {
    errorCode: "JUDGES006",
    errorMessage: "Judge Profile Picture Required!",
  },
  JUDGES007: {
    errorCode: "JUDGES007",
    errorMessage: "Invalid Profile Picture type, must use JPEG or PNG!",
  },
  JUDGES008: {
    errorCode: "JUDGES008",
    errorMessage: "Maximum Upload Size Limit Exceeded for Profile Picture, Please upload it of size less than equal to 5MB!",
  },
}

export const NOMINATIONS = {
  NOMINATIONS000: {
    errorCode: "NOMINATIONS000",
    errorMessage: "Internal Server Error",
  },
  NOMINATIONS001: {
    errorCode: "NOMINATIONS001",
    errorMessage: "Requested Nomination does not exists!",
  },
  NOMINATIONS002: {
    errorCode: "NOMINATIONS002",
    errorMessage: "Nominee Id Required!",
  },
  NOMINATIONS003: {
    errorCode: "NOMINATIONS003",
    errorMessage: "Invalid Nomination Status!",
  },
  NOMINATIONS004: {
    errorCode: "NOMINATIONS004",
    errorMessage: "Invalid Nomination Id!",
  },
  NOMINATIONS005: {
    errorCode: "NOMINATIONS005",
    errorMessage: "Requested Nomination name already exists!",
  },
  NOMINATIONS006: {
    errorCode: "NOMINATIONS006",
    errorMessage: "Nominee Profile Picture Required!",
  },
  NOMINATIONS007: {
    errorCode: "NOMINATIONS007",
    errorMessage: "Invalid Profile Picture type, must use JPEG or PNG!",
  },
  NOMINATIONS008: {
    errorCode: "NOMINATIONS008",
    errorMessage: "Maximum Upload Size Limit Exceeded for Profile Picture, Please upload it of size less than equal to 5MB!",
  },
}

export const VOTES = {
  VOTES000: {
    errorCode: "VOTES000",
    errorMessage: "Internal Server Error",
  }
}

export const SUPPORTREQUESTS = {
  SUPPORTREQUESTS000: {
    errorCode: "SUPPORTREQUESTS000",
    errorMessage: "Internal Server Error",
  },
  SUPPORTREQUESTS001: {
    errorCode: "SUPPORTREQUESTS001",
    errorMessage: "Requested Support Request does not exists!",
  },
}

export const NOTIFICATIONS = {
  NOTIFICATIONS000: {
    errorCode: "NOTIFICATIONS000",
    errorMessage: "Internal Server Error",
  },
  NOTIFICATIONS001: {
    errorCode: "NOTIFICATIONS001",
    errorMessage: "Requested Notification does not exists!",
  },
}