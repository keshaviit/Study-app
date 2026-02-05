
export const endpoints = {
  SENDOTP_API: "/auth/sendOtp",
  SIGNUP_API: "/auth/signUp",
  LOGIN_API: "/auth/login",
  RESETPASSTOKEN_API: "/auth/reset-password-token",
  RESETPASSWORD_API: "/auth/reset-password",
};

export const studentEndpoints = {
  COURSE_PAYMENT_API: "/payment/capturePayment",
  COURSE_VERIFY_API: "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: "/payment/sendPaymentSuccessEmail",
};

export const contactUsEndpoint = {
  CONTACT_US_API: "/reach/contact",
};

export const categories = {
  CATEGORIES_API: "/course/showAllCategories",
};

export const profileEndpoints = {
  GET_USER_DETAILS_API: "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: "/profile/getEnrolledCourses",
};

export const courseEndpoints = {
  GET_ALL_COURSE_API: "/course/getAllCourses",
  COURSE_DETAILS_API: "/course/getCourseDetails",
  EDIT_COURSE_API: "/course/editCourse",
  COURSE_CATEGORIES_API: "/course/showAllCategories",
  CREATE_COURSE_API: "/course/createCourse",

  CREATE_SECTION_API: "/course/createSection",
  CREATE_SUBSECTION_API: "/course/createSubSection",
  UPDATE_SECTION_API: "/course/updateSection",
  UPDATE_SUBSECTION_API: "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: "/course/getInstructorCourses",
  DELETE_SECTION_API: "/course/deleteSection",
  DELETE_SUBSECTION_API: "/course/deleteSubSection",
  DELETE_COURSE_API: "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: "/course/updateCourseProgress",
  CREATE_RATING_API: "/course/createRating",
};

export const catalogData = {
  CATALOGPAGEDATA_API: "/course/getCategoryPageDetails",
};
