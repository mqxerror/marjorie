import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { SiteConfigService } from './config.service';
import { UpsertConfigDto } from './config.dto';
import { ApiKeyGuard } from '../common/api-key.guard';

@ApiTags('config')
@Controller('config')
export class SiteConfigController {
  constructor(private readonly configService: SiteConfigService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get public configuration values' })
  @ApiResponse({ status: 200, description: 'Returns public configuration' })
  async getPublicConfig() {
    return this.configService.getPublicConfig();
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Get all site configuration' })
  @ApiResponse({ status: 200, description: 'Returns all configuration values' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.configService.findAll();
  }

  @Get(':key')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Get configuration by key' })
  @ApiResponse({ status: 200, description: 'Returns configuration value' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async findByKey(@Param('key') key: string) {
    return this.configService.findByKey(key);
  }

  @Put(':key')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Create or update configuration' })
  @ApiResponse({ status: 200, description: 'Configuration saved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async upsert(@Param('key') key: string, @Body() upsertConfigDto: UpsertConfigDto) {
    return this.configService.upsert(key, upsertConfigDto.value);
  }

  @Delete(':key')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Delete configuration' })
  @ApiResponse({ status: 200, description: 'Configuration deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('key') key: string) {
    return this.configService.delete(key);
  }
}
