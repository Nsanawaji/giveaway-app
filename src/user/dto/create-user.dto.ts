export class CreateUserDto {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  location: string;

  @Column({ default: '' })
  gender: string;

  @Column({ default: '' })
  profilePicture: string;
}
