import { ForbiddenException } from "@nestjs/common";

export class BlockedUserException extends ForbiddenException {
  constructor() {
    super(`Sorry, you have been blocked by an admin!`);
  }
}
