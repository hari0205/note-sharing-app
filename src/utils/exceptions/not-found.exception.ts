import { NotFoundException } from '@nestjs/common';

// For throwing an not found exception
export class EntityNotFoundException extends NotFoundException {
  constructor(entity: string, description: string = null) {
    super(`${entity} not found`, {
      cause: new Error(`${entity} not found`),
      description: description || `${entity} not found`,
    });
  }
}
