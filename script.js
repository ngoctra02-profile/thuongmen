function openGift() {
    const giftScreen = document.getElementById('screen-gift');
    
    // Bắt đầu hiệu ứng làm mờ video hộp quà
    giftScreen.classList.remove('active');
    giftScreen.classList.add('fade-blur');
    
    // Bật nhạc nền, bắt đầu từ giây thứ 14 và làm hiệu ứng nhỏ to dần (fade-in)
    const bgMusic = document.getElementById('bg-music');
    bgMusic.currentTime = 14; 
    bgMusic.volume = 0; // Bắt đầu với âm lượng 0 để tránh giật mình
    bgMusic.play();
    
    // Hiệu ứng Fade-in nhạc (tăng dần âm lượng lên 1.0 trong khoảng 2.5 giây)
    let fadeAudio = setInterval(function () {
        if (bgMusic.volume < 0.95) {
            bgMusic.volume += 0.05;
        } else {
            bgMusic.volume = 1;
            clearInterval(fadeAudio);
        }
    }, 125); // 20 bước * 125ms = 2.5 giây
    
    // Tạo một BỨC TƯỜNG HOA khổng lồ rơi lấp đầy màn hình (Đã tối ưu chống giật)
    // GIẢI PHÁP TỐI THƯỢNG CHO ĐỘ MƯỢT KHI XUẤT HIỆN SCRAPBOOK:
    // Hàng ngàn thẻ HTML độc lập sẽ làm máy bị quá tải khi chuyển cảnh.
    // Ta gộp 3-5 bông hoa vào cùng một thẻ. Mắt người vẫn thấy hàng ngàn bông hoa rơi,
    // nhưng máy tính chỉ phải gánh 1/5 khối lượng công việc => Chuyển cảnh mượt 60fps.
    // Trả lại toàn bộ là hoa đơn lẻ (không dùng cụm nữa để tránh bị dính chùm mất tự nhiên)
    const flowers = ['🌸', '🌺', '💮', '✨', '🌷', '🌹']; 
    const animations = ['denseFall1', 'denseFall2', 'denseFall3'];
    
    // Tốc độ bơm 20ms và xả 10 bông lẻ mỗi nhịp. 
    // Mức này tạo ra chuẩn 500 bông/giây: Siêu bão hoa ngợp trời theo đúng yêu cầu!
    const rainInterval = setInterval(() => {
        const fragment = document.createDocumentFragment();
        const spawnCount = 10; 
        
        for (let i = 0; i < spawnCount; i++) {
            const flower = document.createElement('div');
            flower.classList.add('dense-flower');
            flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
            
            flower.style.left = (Math.random() * 120 - 10) + 'vw'; 
            
            // Tính toán kích thước hoa theo màn hình: Mobile (dưới 768px) thì hoa nhỏ hơn
            const isMobile = window.innerWidth < 768;
            const baseSize = isMobile ? 10 : 15;
            const randomExtra = isMobile ? 10 : 20;
            flower.style.fontSize = (Math.random() * randomExtra + baseSize) + 'px'; 

            
            flower.style.animationName = animations[Math.floor(Math.random() * animations.length)];
            flower.style.animationDuration = (Math.random() * 3 + 3) + 's'; 
            flower.style.animationTimingFunction = 'linear';
            flower.style.animationFillMode = 'forwards';
            
            fragment.appendChild(flower);
            
            // Xóa rác sau 7s để dọn dẹp RAM trước khi scrapbook hiện ra
            setTimeout(() => {
                if (flower.parentNode) flower.remove();
            }, 7000);
        }
        
        document.body.appendChild(fragment);
    }, 20); 
    
    // Sau đúng 5 giây (đã cắt ngắn bớt để tối ưu sự mượt mà), khóa "vòi rồng" xả hoa và hiện bức thư
    setTimeout(() => {
        clearInterval(rainInterval);
        
        const letterScreen = document.getElementById('screen-letter');
        letterScreen.classList.add('active');
        
        // Bật mưa lả lướt của bức thư (background)
        startFallingFlowers();
    }, 5000);
}

// HÀM TẠO HIỆU ỨNG HOA RƠI LÁC ĐÁC (Cho Scrapbook)
function startFallingFlowers() {
    const container = document.querySelector('.scrapbook-wrapper');
    const flowers = ['🌸', '🌺', '💮', '🏵️', '✨', '🌷', '🌹', '🌻', '🌼']; 
    
    // Thuật toán CHIA SLOT (Vị trí): Chia màn hình thành 40 ô ngang bằng nhau
    const totalSlots = 40; 
    let availableSlots = [];
    
    function fillSlots() {
        for (let i = 0; i < totalSlots; i++) {
            availableSlots.push(i);
        }
        // Xáo trộn ngẫu nhiên để hoa rơi tự nhiên, không rơi theo hàng chéo
        availableSlots.sort(() => Math.random() - 0.5);
    }
    fillSlots();
    
    setInterval(() => {
        if (availableSlots.length === 0) fillSlots();
        const currentSlot = availableSlots.pop(); // Rút ra 1 vị trí độc nhất (không trùng)
        
        const flower = document.createElement('div');
        flower.classList.add('falling-flower');
        flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
        
        // Đặt hoa vào chính xác vị trí slot của nó
        flower.style.left = (currentSlot * (96 / totalSlots)) + 2 + 'vw';
        
        // Kích thước hoa lác đác (Mobile nhỏ hơn)
        const isMobile = window.innerWidth < 768;
        const baseSize = isMobile ? 12 : 18;
        const randomExtra = isMobile ? 5 : 8;
        const size = Math.random() * randomExtra + baseSize; 
        flower.style.fontSize = size + 'px';
        
        // Cố định thời gian rơi (chỉ chênh 1-2s) để hoa sinh sau KHÔNG THỂ rơi vượt mặt đè lên hoa sinh trước
        const fallTime = Math.random() * 2 + 25; 
        
        // Thời gian đọng lại 6s, chu kỳ rút slot là 10s => Đảm bảo hoa cũ bốc hơi sạch trước khi hoa mới rớt xuống vị trí đó
        const totalTime = fallTime / 0.8; 
        flower.style.animationDuration = totalTime + 's'; 
        
        flower.style.setProperty('--bottom-offset', (size + 15) + 'px');
        
        container.appendChild(flower);
        
        setTimeout(() => {
            if (flower.parentNode) flower.remove();
        }, totalTime * 1000); 
    }, 250); 
}
