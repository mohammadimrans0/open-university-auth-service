import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { ManagementDepartmentController } from './managementDepartment.controller'
import { ManagementDepartmentValidation } from './managementDepartment.validation'

const router = express.Router()

router.post(
  '/create-department',
  validateRequest(
    ManagementDepartmentValidation.createManagementDepartmentZodSchema
  )
)

router.get('/:id', ManagementDepartmentController.getSingleDepartment)

router.patch(
  '/:id',
  validateRequest(
    ManagementDepartmentValidation.updateManagementDepartmentZodSchema
  ),
  ManagementDepartmentController.updateDepartment
)

router.delete('/:id', ManagementDepartmentController.deleteDepartment)

router.get('/', ManagementDepartmentController.getAllDepartments)

export const ManagementDepartmentRoutes = router
