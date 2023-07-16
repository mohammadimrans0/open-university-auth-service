import mongoose from 'mongoose'
import config from '../../../config/index'
import ApiError from '../../../errors/ApiError'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { IStudent } from '../student/student.interface'
import { IUser } from './user.interface'
import { User } from './user.model'
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils'
import { Student } from '../student/student.model'
import { IAcademicSemester } from '../academicSemester/academicSemester.interface'
import httpStatus from 'http-status'
import { IFaculty } from '../faculty/faculty.interface'
import { IAdmin } from '../admin/admin.interface'
import { Faculty } from '../faculty/faculty.model'
import { Admin } from '../admin/admin.model'

// create student
const createStudent = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null | undefined> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_password as string
  }

  // set role
  user.role = 'student'

  const academicSemester = await AcademicSemester.findById(
    student.academicSemester
  )

  // start session
  const session = await mongoose.startSession()

  try {
    // start transaction
    session.startTransaction()

    // generate Student Id
    let newUserAllData = null
    const id = await generateStudentId(academicSemester as IAcademicSemester)
    user.id = id
    student.id = id

    // creating student
    const newStudent = await Student.create([student], { session })

    if (!newStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student')
    }

    // set student _id (reference) into user.student
    user.student = newStudent[0]._id

    // creating user
    const newUser = await User.create([user], { session })

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    newUserAllData = newUser[0]

    if (newUserAllData) {
      newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
        path: 'student',
        populate: [
          { path: 'academicSemester' },
          { path: 'academicDepartment' },
          { path: 'academicFaculty' },
        ],
      })

      return newUserAllData
    }

    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

// create faculty
const createFaculty = async (
  faculty: IFaculty,
  user: IUser
): Promise<IUser | null> => {
  // If password is not given,set default password
  if (!user.password) {
    user.password = config.default_faculty_password as string
  }

  // set role
  user.role = 'faculty'

  let newUserAllData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    // generate faculty id
    const id = await generateFacultyId()
    // set custom id into both  faculty & user
    user.id = id
    faculty.id = id
    // Create faculty using sesssin
    const newFaculty = await Faculty.create([faculty], { session })

    if (!newFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty ')
    }
    // set faculty _id (reference) into user.student
    user.faculty = newFaculty[0]._id

    const newUser = await User.create([user], { session })

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty')
    }
    newUserAllData = newUser[0]

    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'faculty',
      populate: [
        {
          path: 'academicDepartment',
        },
        {
          path: 'academicFaculty',
        },
      ],
    })
  }

  return newUserAllData
}

// create admin
const createAdmin = async (
  admin: IAdmin,
  user: IUser
): Promise<IUser | null> => {
  // If password is not given,set default password
  if (!user.password) {
    user.password = config.default_admin_password as string
  }

  // set role
  user.role = 'admin'

  let newUserAllData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    // generate admin id
    const id = await generateAdminId()
    user.id = id
    admin.id = id

    const newAdmin = await Admin.create([admin], { session })

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty ')
    }

    user.admin = newAdmin[0]._id

    const newUser = await User.create([user], { session })

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin')
    }
    newUserAllData = newUser[0]

    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'admin',
      populate: [
        {
          path: 'managementDepartment',
        },
      ],
    })
  }

  return newUserAllData
}

export const UserService = { createStudent, createFaculty, createAdmin }
