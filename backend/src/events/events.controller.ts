import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './events.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active event sessions' })
  @ApiResponse({ status: 200, description: 'Returns all active event sessions' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city name' })
  async findAll(@Query('city') city?: string) {
    if (city) {
      return this.eventsService.findByCity(city);
    }
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event session by ID' })
  @ApiResponse({ status: 200, description: 'Returns event session details' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new event session' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update event session' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event session' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  async delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
