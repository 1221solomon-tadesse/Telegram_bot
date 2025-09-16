import { Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProfileService } from './upload-profile.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
@Controller('profile')
export class UploadProfileController {
  constructor(
    private readonly uploadProfileService: UploadProfileService,
    private readonly userService: UserService
  ) { }
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('profile'))
  async uploadProfile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ) {
    const user = await this.userService.findOneByEmail(req.user.username)
    const ext = file.mimetype.split("/")[1]
    const path = `profiles/${(user).id}.${ext}`;
    const fileKey = await this.uploadProfileService.upload(path, file.buffer, file.mimetype);

    await this.userService.update(req.user.token, user.id, { profile_picture: path })
    return {
      message: 'File uploaded successfully',
      url: fileKey,
      mimetype: file.mimetype
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('view')
  async viewProfile(@Request() req: any) {
    const user = await this.userService.findOneByEmail(req.user.username);
    const filekey = user.profile_picture

    if (!user?.profile_picture) {
      throw new HttpException('No profile picture found', HttpStatus.NOT_FOUND);
    }

    const signedUrl = await this.uploadProfileService.getProfile(filekey);
    return signedUrl;
  }
}
