import { Model } from 'mongoose'

export type IAcademicFaculty = {
  title: string
}

export type AcademicFacultyModel = Model<
  IAcademicFaculty,
  Record<string, unknown>
>

export type IAcademicFacultyFilters = {
  searchTerm?: string
}

export type AcademicFacultyCreateAndUpdateEvent = {
  id: string
  title: string
}

export type AcademicFacultyDeletedEvent = {
  id: string
}
