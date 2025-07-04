import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { typeOrmConfig } from './cofig/typeorm.config';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal:true
  }),
  TypeOrmModule.forRootAsync({
    useFactory: typeOrmConfig,
    inject: [ConfigService]
  }),
  CategoriesModule,
  ProductsModule,
  TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
