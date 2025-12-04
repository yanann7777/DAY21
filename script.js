// ==========================================
// 1. 吉伊卡哇角色與美食資料
// ==========================================
// 這裡使用 Placehold.co 產生示意圖，您可以換成真實圖片連結
const chiikawaChars = [
    { id: 'chiikawa', name: '小可愛', color: '#FFFFFF', image: 'https://placehold.co/100x100/FFFFFF/FF69B4?text=小可愛' },
    { id: 'hachi', name: '小八', color: '#87CEEB', image: 'https://placehold.co/100x100/87CEEB/FFFFFF?text=小八' },
    { id: 'usagi', name: '兔兔', color: '#FFFACD', image: 'https://placehold.co/100x100/FFFACD/DAA520?text=兔兔' },
    { id: 'momonga', name: '小桃', color: '#E0FFFF', image: 'https://placehold.co/100x100/E0FFFF/008080?text=小桃' },
    { id: 'kurimanju', name: '栗子', color: '#DEB887', image: 'https://placehold.co/100x100/DEB887/8B4513?text=栗子' },
    { id: 'rakko', name: '海獺', color: '#8B4513', image: 'https://placehold.co/100x100/8B4513/FFFFFF?text=海獺' },
    { id: 'anoko', name: '那孩子', color: '#D3D3D3', image: 'https://placehold.co/100x100/D3D3D3/000000?text=那孩子' }
];

const poolSSR = [
    "頂級和牛丼飯", "龍蝦沙拉三明治", "蒲燒鰻魚飯定食", "松露野菇燉飯", 
    "特級海陸大餐", "Prime等級牛排飯", "豪華綜合生魚片丼"
];
const poolSR = [
    "日式鹽烤鯖魚", "舒肥雞胸肉波基碗", "泰式打拋豬(正宗)", "花雕雞腿定食",
    "清蒸鱸魚套餐", "紅燒牛腱飯", "日式炸豬排(腰內肉)", "鮭魚排佐時蔬",
    "韓式石鍋拌飯", "越式生牛肉河粉", "香煎干貝義大利麵", "海南雞飯(腿肉)"
];
const poolN = [
    "便利商店: 雞胸肉組合", "便利商店: 鮪魚飯糰", "傻瓜乾麵", "水餃10顆",
    "榨菜肉絲麵", "陽春麵+滷蛋", "潤餅", "Subway 6吋潛艇堡",
    "雞肉飯便當", "排骨飯", "蛋炒飯", "皮蛋瘦肉粥",
    "麻醬麵", "控肉飯", "米粉湯+黑白切", "關東煮組合",
    "肉圓+貢丸湯", "大腸包小腸", "涼麵+味噌湯", "自助餐(三菜一肉)"
];

// ==========================================
// 2. 初始化與變數
// ==========================================
const drawBtn = document.getElementById('drawBtn');
const clearBtn = document.getElementById('clearBtn');
const resultBody = document.getElementById('resultBody');
const overlay = document.getElementById('gachaOverlay');
const avatarGrid = document.getElementById('avatarGrid');
const STORAGE_KEY = 'gacha_lunch_chiikawa_v2'; // 更新 key 避免舊邏輯干擾

// 頁面載入執行
window.addEventListener('load', function() {
    initAvatars(); 
    loadHistory(); 
});

// ==========================================
// 3. 頭貼選擇邏輯 (含名字顯示版)
// ==========================================
function initAvatars() {
    if (!avatarGrid) return;
    avatarGrid.innerHTML = '';
    
    chiikawaChars.forEach(function(char, index) {
        // 建立容器
        const wrapper = document.createElement('div');
        wrapper.className = 'avatar-wrapper';
        
        // 建立圖片
        const img = document.createElement('img');
        img.src = char.image;
        img.className = 'avatar-option';
        
        // 建立名字
        const nameSpan = document.createElement('span');
        nameSpan.textContent = char.name;
        nameSpan.className = 'avatar-name';

        // 預設選中第一個
        if (index === 0) {
            wrapper.classList.add('selected');
            const hiddenInput = document.getElementById('selectedAvatar');
            if(hiddenInput) hiddenInput.value = char.image;
        }

        // 點擊事件
        wrapper.addEventListener('click', function() {
            document.querySelectorAll('.avatar-wrapper').forEach(function(el) {
                el.classList.remove('selected');
            });
            wrapper.classList.add('selected');
            const hiddenInput = document.getElementById('selectedAvatar');
            if(hiddenInput) hiddenInput.value = char.image;
        });

        wrapper.appendChild(img);
        wrapper.appendChild(nameSpan);
        avatarGrid.appendChild(wrapper);
    });
}

// ==========================================
// 4. 轉蛋功能函式
// ==========================================
function startGacha() {
    const nameInput = document.getElementById('username').value;
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const avatarSrcInput = document.getElementById('selectedAvatar');

    if (nameInput.trim() === "") {
        alert("請輸入召喚師名字！");
        return;
    }

    // 鎖定 UI
    drawBtn.disabled = true;
    overlay.classList.remove('hidden');
    
    // 機率判定
    const rand = Math.random() * 100;
    let selectedFood = "";
    let selectedRarity = "";

    if (rand >= 95) { 
        selectedRarity = "SSR"; selectedFood = poolSSR[Math.floor(Math.random() * poolSSR.length)];
    } else if (rand >= 70) { 
        selectedRarity = "SR"; selectedFood = poolSR[Math.floor(Math.random() * poolSR.length)];
    } else {
        selectedRarity = "N"; selectedFood = poolN[Math.floor(Math.random() * poolN.length)];
    }

    // 動畫等待
    setTimeout(function() {
        overlay.classList.add('hidden');
        drawBtn.disabled = false;
        
        // 呼叫資料處理
        handleData(
            nameInput, 
            genderInput ? genderInput.value : 'boy', 
            avatarSrcInput ? avatarSrcInput.value : chiikawaChars[0].image, 
            selectedRarity, 
            selectedFood
        );
    }, 2000);
}

// ==========================================
// 5. 資料處理與渲染 (保證每筆都顯示)
// ==========================================
function handleData(name, gender, avatar, rarity, food) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const yyyy = tomorrow.getFullYear();
    const mm = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const dd = tomorrow.getDate().toString().padStart(2, '0');
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const dayName = days[tomorrow.getDay()];
    
    const fullDateStr = `${yyyy}/${mm}/${dd} (週${dayName})`;

    const newRecord = {
        rarity: rarity,
        fullDate: fullDateStr,
        username: name,
        gender: gender,
        avatar: avatar,
        food: food
    };

    saveToStorage(newRecord);
    loadHistory(); // 重新讀取顯示
}

function saveToStorage(newRecord) {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch(e) { history = []; }
    
    // 【關鍵】這裡沒有 filter，直接加到最前面
    history.unshift(newRecord);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function loadHistory() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    resultBody.innerHTML = ''; 

    if (savedData) {
        try {
            const arr = JSON.parse(savedData);
            if (arr.length > 0) {
                // 這裡沒有任何隱藏重複的邏輯，會逐筆顯示
                arr.forEach(function(record) {
                    const row = document.createElement('tr');
                    
                    // 頭貼
                    const avatarImg = `<img src="${record.avatar}" class="table-avatar">`;

                    // 性別
                    let genderIcon = "";
                    if(record.gender === "boy") genderIcon = "♂️";
                    else if(record.gender === "girl") genderIcon = "♀️";
                    else if(record.gender === "other") genderIcon = "🌈";

                    // 稀有度
                    const rarityBadge = `<span class="tag tag-${record.rarity}">${record.rarity}</span>`;
                    
                    // 美食樣式
                    let foodStyle = "";
                    if (record.rarity === "SSR") foodStyle = "color: #ff69b4; font-weight:800; text-shadow: 1px 1px 0 #fff;";
                    else if (record.rarity === "SR") foodStyle = "color: #ff9f43; font-weight:800;";

                    // 每一行都完整填入
                    row.innerHTML = `
                        <td>${avatarImg}</td>
                        <td>${rarityBadge}</td>
                        <td>${record.fullDate}</td>
                        <td>${record.username} ${genderIcon}</td>
                        <td style="${foodStyle}">${record.food}</td>
                    `;
                    
                    resultBody.appendChild(row);
                });
                
                // 動畫
                const firstRow = resultBody.querySelector('tr');
                if(firstRow) firstRow.classList.add('new-row');
                return;
            }
        } catch(e) { console.error(e); }
    }
    
    // 空狀態
    resultBody.innerHTML = '<tr id="placeholderRow"><td colspan="5" class="empty-state">還沒有召喚紀錄捏... ( •̀ ω •́ )✧</td></tr>';
}

// 綁定事件
if(clearBtn) {
    clearBtn.addEventListener('click', function() {
        if(confirm("確定要清除本本嗎？")) {
            localStorage.removeItem(STORAGE_KEY);
            loadHistory();
        }
    });
}

if(drawBtn) {
    drawBtn.addEventListener('click', startGacha);
}