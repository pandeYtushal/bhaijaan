import sharp from 'sharp';
import path from 'path';

const sourcePhoto = 'C:/Users/tusha/.gemini/antigravity-ide/brain/dcc6eaf8-2fdb-44bf-ab2b-27147b4e4d8f/.user_uploaded/media_1787422861694.jpg';
const destDesktop = 'c:/Users/tusha/OneDrive/Desktop/bhaijaan/public/bg-bhaijaan-room.jpg';
const destMobile = 'c:/Users/tusha/OneDrive/Desktop/bhaijaan/public/bg-mobile-bhaijaan.jpg';

async function refineImages() {
  console.log('Processing 4K images with sharp...');
  
  // 1. Desktop 4K (3840x2160) landscape composition
  await sharp(sourcePhoto)
    .resize(3840, 2160, {
      fit: 'cover',
      position: 'top',
      kernel: sharp.kernel.lanczos3
    })
    .sharpen({
      sigma: 1.2,
      m1: 1.0,
      m2: 2.0
    })
    .modulate({
      brightness: 0.95,
      saturation: 1.06,
    })
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile(destDesktop);
    
  console.log('Desktop 4K background generated at:', destDesktop);

  // 2. Mobile 4K (2160x3840) portrait composition
  await sharp(sourcePhoto)
    .resize(2160, 3840, {
      fit: 'cover',
      position: 'top',
      kernel: sharp.kernel.lanczos3
    })
    .sharpen({
      sigma: 1.3,
      m1: 1.0,
      m2: 2.5
    })
    .modulate({
      brightness: 0.95,
      saturation: 1.08,
    })
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile(destMobile);

  console.log('Mobile 4K background generated at:', destMobile);
}

refineImages().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});
