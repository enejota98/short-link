import { Link } from './entities/link.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Link)
    private linkRepo: Repository<Link>
  ){}
  async encode(req: Request): Promise<Object> {
    const url = req.body.url;
    const host = req.headers.host;

    const validUrl = this.isValidUrl(url)
    
    if(!validUrl) {
      throw new BadRequestException('URL is Invalid')
    }

    const code = Math.random().toString(36).slice(6)
    const link = this.linkRepo.create({
      url,
      code
    })
    const result = await this.linkRepo.save(link);

    return {
      url: `${host}/${result.code}`
    }
  }

  private isValidUrl(url: string) {
    let url_string: any; 
    try {
      url_string = new URL(url);
    } catch (_) {
      return false;  
    }
    
    return url_string.protocol === "http:" || url_string.protocol === "https:" ;
  }

  async decode(code: string): Promise<Link> {
    const link = await this.linkRepo.findOne({code})
    if(!link) {
      throw new BadRequestException()
    }
    
    let count = link.hits + 1
    await this.linkRepo.update(link.id, {hits: count})
    
    return link
  }
}
