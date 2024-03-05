import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SEOFilterDto } from './dto/seo.filter';
import { SeoService } from './seo.service';

@ApiTags('seo')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @ApiOperation({ summary: 'Get SEO Infomation' })
  @Get()
  async findAll(@Query() input: SEOFilterDto) {
    // return await this.seoService.findAll(input);
  }
}
