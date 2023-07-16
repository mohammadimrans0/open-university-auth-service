import express from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validateRequest'
import { AcademicFacultyController } from './academicFaculty.controller'
import { AcademicFacultyValidation } from './academicFaculty.validation'

const router = express.Router()

router.post(
  '/create-faculty',
  validateRequest(AcademicFacultyValidation.createFacultyZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicFacultyController.createFaculty
)

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  AcademicFacultyController.getSingleFaculty
)

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  AcademicFacultyController.getAllFaculties
)

router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.updateFacultyZodSchema),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  AcademicFacultyController.updateFaculty
)

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AcademicFacultyController.deleteFaculty
)

export const AcademicFacultyRoutes = router
