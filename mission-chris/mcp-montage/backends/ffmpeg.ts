/**
 * Backend FFmpeg : controle total, pas de cout par rendu.
 * Implementation reelle a faire Semaine 3 si on retient cette option.
 */
import { spawn } from 'node:child_process';
import type {
  MontageBackend, CutParams, ConcatParams, AddTextParams,
  AddSubtitlesParams, AddMusicParams, ExportParams,
} from '../tools/index.js';

export class FfmpegBackend implements MontageBackend {
  nom = 'ffmpeg';

  async cut(p: CutParams) {
    await run(['-y', '-i', p.input, '-ss', String(p.start), '-to', String(p.end), '-c', 'copy', p.output]);
    return { output: p.output };
  }

  async concat(p: ConcatParams) {
    // TODO : generer une liste de concat ou utiliser le filter_complex pour les transitions.
    const list = p.inputs.map(i => `file '${i}'`).join('\n');
    const tmp = p.output + '.list.txt';
    await import('node:fs/promises').then(fs => fs.writeFile(tmp, list));
    await run(['-y', '-f', 'concat', '-safe', '0', '-i', tmp, '-c', 'copy', p.output]);
    return { output: p.output };
  }

  async add_text(_p: AddTextParams) {
    throw new Error('TODO Semaine 3 : drawtext filter avec fonts custom');
  }
  async add_subtitles(_p: AddSubtitlesParams) {
    throw new Error('TODO Semaine 3 : whisper + ass + drawtext ou subtitles filter');
  }
  async add_music(_p: AddMusicParams) {
    throw new Error('TODO Semaine 3 : amix avec ducking sidechaincompress');
  }
  async export(p: ExportParams) {
    await run([
      '-y', '-i', p.input,
      '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
      '-r', '30', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
      p.output,
    ]);
    return { output: p.output };
  }
}

function run(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: 'inherit' });
    p.on('close', c => c === 0 ? resolve() : reject(new Error(`ffmpeg exit ${c}`)));
  });
}
