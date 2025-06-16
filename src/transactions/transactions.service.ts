import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Product } from 'src/products/entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {

  constructor(
      @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
      @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>
    //  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  
    ) { }
  async create(createTransactionDto: CreateTransactionDto) {
    
    const transaction = new Transaction()
    transaction.total = createTransactionDto.total
    await this.transactionRepository.save(transaction)

    for(const contents of createTransactionDto.contents){
      await this.transactionContentsRepository.save({...contents, transaction})
    }
  
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
