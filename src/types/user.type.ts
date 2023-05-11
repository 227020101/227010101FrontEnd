export default interface IUser {
  id?: any | null,
  firstname?: string | null,
  lastname?: string | null,
  username?: string | null,
  email?: string,
  password?: string,
  userrole?: Array<string>
}