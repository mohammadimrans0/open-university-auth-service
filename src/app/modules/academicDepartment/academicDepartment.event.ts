import { RedisClient } from '../../../shared/redis'
import {
  EVENT_ACADEMIC_DEPARTMENT_CREATED,
  EVENT_ACADEMIC_DEPARTMENT_DELETED,
  EVENT_ACADEMIC_DEPARTMENT_UPDATED,
} from './academicDepartment.constant'
import {
  AcademicDepartmentCreateAndUpdateEvent,
  AcademicDepartmentDeletedEvent,
} from './academicDepartment.interface'
import { AcademicDepartmentService } from './academicDepartment.service'

const initAcademicDepartmentEvents = () => {
  RedisClient.subscribe(
    EVENT_ACADEMIC_DEPARTMENT_CREATED,
    async (e: string) => {
      const data: AcademicDepartmentCreateAndUpdateEvent = JSON.parse(e)

      await AcademicDepartmentService.insertIntoDBFromEvent(data)
    }
  )

  RedisClient.subscribe(
    EVENT_ACADEMIC_DEPARTMENT_UPDATED,
    async (e: string) => {
      const data: AcademicDepartmentCreateAndUpdateEvent = JSON.parse(e)

      await AcademicDepartmentService.updateOneInDBFromEvent(data)
    }
  )

  RedisClient.subscribe(
    EVENT_ACADEMIC_DEPARTMENT_DELETED,
    async (e: string) => {
      const data: AcademicDepartmentDeletedEvent = JSON.parse(e)

      await AcademicDepartmentService.deleteOneFromDBFromEvent(data.id)
    }
  )
}

export default initAcademicDepartmentEvents
