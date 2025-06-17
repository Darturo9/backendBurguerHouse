import { BadRequestException, Injectable } from '@nestjs/common';
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
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    //  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    @InjectRepository(Product) private readonly productRepository: Repository<Product>


  ) { }
  async create(createTransactionDto: CreateTransactionDto) {

    await this.productRepository.manager.transaction(async (transactionEntityManager) => {

      const transaction = new Transaction()
      transaction.total = createTransactionDto.total


      for (const contents of createTransactionDto.contents) {
        const product = await transactionEntityManager.findOneBy(Product, { id: contents.productId });
        if (!product) {
          throw new Error(`Producto con id ${contents.productId} no encontrado`);
        }
        if (contents.quantity > product.inventory) {
          throw new BadRequestException(`El articulo ${product.name} excede la cantidad disponible`)

        }
        product.inventory -= contents.quantity;

        const transactionContent = new TransactionContents()

        transactionContent.price = contents.price
        transactionContent.product = product
        transactionContent.quantity = contents.quantity
        transactionContent.transaction = transaction

        await transactionEntityManager.save(transaction)
        await transactionEntityManager.save(transactionContent);
      }


    })



    return "Venta creada exitosamente"
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
