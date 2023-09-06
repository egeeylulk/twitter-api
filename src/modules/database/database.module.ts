// database.module.ts
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service'; // Adjust import path as needed
import { databaseProviders } from './database.providers';

@Module({
  providers: [DatabaseService, ...databaseProviders],
  exports: [DatabaseService], // Make the DatabaseService available for other modules
})
export class DatabaseModule {}
