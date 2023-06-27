import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { spawn } from 'child_process';

const pythonProcess = spawn('python', ['./src/tg_bot.py']);

pythonProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

