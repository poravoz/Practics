import { Controller, Get, Post, Body, Delete } from '@nestjs/common';

@Controller('videos')
export class VideosController {
  private latestVideoUrl: string;

  @Post()
  handlePostRequest(@Body() payload: any): string {
    const latestVideoUrl = payload.latest_video_url;
    console.log('Received latestVideoUrl:', latestVideoUrl);
    this.latestVideoUrl = latestVideoUrl;
    return this.latestVideoUrl;
  }

  @Get()
  async getLatestVideoUrl(): Promise<string> {
    if (this.latestVideoUrl) {
      return this.latestVideoUrl;
    } else {
      return ' '
    }
  }

  @Delete()
  async deleteLatestVideoUrl(): Promise<void> {
    this.latestVideoUrl = '';
  }
}
