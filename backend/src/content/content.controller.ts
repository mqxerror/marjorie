import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active section content' })
  @ApiResponse({ status: 200, description: 'Returns all active section content' })
  async findAll() {
    return this.contentService.findAll();
  }

  @Get(':sectionKey')
  @ApiOperation({ summary: 'Get content by section key' })
  @ApiResponse({ status: 200, description: 'Returns content for a specific section' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async findByKey(@Param('sectionKey') sectionKey: string) {
    return this.contentService.findByKey(sectionKey);
  }

  @Post()
  @ApiOperation({ summary: 'Create new section content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  async create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Put(':sectionKey')
  @ApiOperation({ summary: 'Update section content' })
  @ApiResponse({ status: 200, description: 'Content updated successfully' })
  async update(
    @Param('sectionKey') sectionKey: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.update(sectionKey, updateContentDto);
  }

  @Delete(':sectionKey')
  @ApiOperation({ summary: 'Delete section content' })
  @ApiResponse({ status: 200, description: 'Content deleted successfully' })
  async delete(@Param('sectionKey') sectionKey: string) {
    return this.contentService.delete(sectionKey);
  }
}
