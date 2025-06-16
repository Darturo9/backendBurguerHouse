import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository (Product) private readonly productRepository : Repository<Product>,
    @InjectRepository (Category) private readonly categoryRepository : Repository<Category>

  ){}
  
  
  async create(createProductDto: CreateProductDto) {
  
    const category = await this.categoryRepository.findOneBy({id :createProductDto.categoryId })
    if (!category) {

      let errors : string [] = []
      errors.push("La categororia no existe")
      throw new NotFoundException(errors)

    }
    return this.productRepository.save({
      ...createProductDto,
      category
    })

  }

  async findAll(categoryId : number | null, take: number, skip: number) {

    const options : FindManyOptions<Product> = {
      relations:{
        category:true
      },
      order: {
        id: 'DESC'
      },
      take,
      skip,
    }

    if (categoryId) {
      options.where = {
        category : {
          id:categoryId
        }
      }
    }

    const [productos, total] = await this.productRepository.findAndCount( options)
    return {
      productos,
      total
    }
  }

  async findOne(id: number) {
  
    const product = await this.productRepository.findOne({
      where:{
        id
      },
      relations :{
        category: true
      }
    })

    if(!product) {
      throw new NotFoundException(`El producto con el ID: ${id} no fue encontrado`)
    }

    return product
  
  }


  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
