// ==========================================
// 1. 吉伊卡哇角色與美食資料
// ==========================================
const chiikawaChars = [
    { id: 'chiikawa', name: '小可愛', color: '#FFFFFF', image: 'https://www.popdaily.com.tw/shaper/u/202409/a295268a-c228-418e-a4df-e059b7538ea9.png?resize-w=1300&resize-h=1300&format=webp' },
    { id: 'hachi', name: '小八', color: '#87CEEB', image: 'https://www.popdaily.com.tw/shaper/u/202409/fd4138c3-7bc4-483e-b54d-06d493792db6.png?resize-w=1300&resize-h=1300&format=webp' },
    { id: 'usagi', name: '兔兔', color: '#FFFACD', image: 'https://www.popdaily.com.tw/shaper/u/202409/f7984971-9f2d-4ccf-963f-7cc7acfec817.png?resize-w=1300&resize-h=1300&format=webp' },
    { id: 'momonga', name: '小桃', color: '#E0FFFF', image: 'https://www.popdaily.com.tw/shaper/u/202409/9fd5d003-ac74-4eca-b6b0-5817e26ebc4c.png?resize-w=1300&resize-h=1300&format=webp' },
    { id: 'kurimanju', name: '栗子', color: '#DEB887', image: 'https://www.popdaily.com.tw/shaper/u/202409/c165f1b6-31ec-4d58-b6be-aae4a912499b.png?resize-w=1300&resize-h=1300&format=webp' },
    { id: 'rakko', name: '海獺', color: '#8B4513', image: 'https://www.popdaily.com.tw/shaper/u/202409/f37ba11a-92ae-4d3f-9f82-4aa947c35421.png?resize-w=1300&resize-h=1300&format=webp' },
    { id: 'anoko', name: '那孩子', color: '#D3D3D3', image: 'https://www.popdaily.com.tw/shaper/u/202409/b2664bda-46c6-4506-9a9d-ef214a7da9da.png?resize-w=1300&resize-h=1300&format=webp' }
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
const STORAGE_KEY = 'gacha_lunch_chiikawa_v1';

window.addEventListener('load', () => {
    initAvatars(); 
    loadHistory(); 
});

// ==========================================
// 3. 頭貼選擇邏輯 (含名字顯示)
// ==========================================
function initAvatars() {
    if (!avatarGrid) return;
    avatarGrid.innerHTML = '';
    
    chiikawaChars.forEach(function(char, index) {
        // 1. 建立外層容器 (Wrapper)
        const wrapper = document.createElement('div');
        wrapper.className = 'avatar-wrapper';
        
        // 2. 建立圖片 (Image)
        const img = document.createElement('img');
        img.src = char.image;
        img.className = 'avatar-option';
        
        // 3. 建立名字標籤 (Name Label)
        const nameSpan = document.createElement('span');
        nameSpan.textContent = char.name;
        nameSpan.className = 'avatar-name';

        // 4. 預設選中第一個
        if (index === 0) {
            wrapper.classList.add('selected');
            const hiddenInput = document.getElementById('selectedAvatar');
            if(hiddenInput) hiddenInput.value = char.image;
        }

        // 5. 點擊事件 (綁定在 Wrapper 上)
        wrapper.addEventListener('click', function() {
            // 移除所有人的 selected 樣式
            document.querySelectorAll('.avatar-wrapper').forEach(function(el) {
                el.classList.remove('selected');
            });
            
            // 自己加上 selected
            wrapper.classList.add('selected');
            
            // 更新隱藏欄位的值
            const hiddenInput = document.getElementById('selectedAvatar');
            if(hiddenInput) hiddenInput.value = char.image;
        });

        // 6. 組裝並加入畫面
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
    const avatarSrc = document.getElementById('selectedAvatar').value;

    if (nameInput.trim() === "") {
        alert("請輸入召喚師名字！");
        return;
    }

    // 鎖定 UI
    drawBtn.disabled = true;
    overlay.classList.remove('hidden');
    
    // 機率判定
    const rand = Math.random() * 100;
    let selectedFood = "", selectedRarity = "";

    if (rand >= 95) { 
        selectedRarity = "SSR"; selectedFood = poolSSR[Math.floor(Math.random() * poolSSR.length)];
    } else if (rand >= 70) { 
        selectedRarity = "SR"; selectedFood = poolSR[Math.floor(Math.random() * poolSR.length)];
    } else {
        selectedRarity = "N"; selectedFood = poolN[Math.floor(Math.random() * poolN.length)];
    }

    // 動畫等待
    setTimeout(() => {
        overlay.classList.add('hidden');
        drawBtn.disabled = false;
        
        handleData(nameInput, genderInput.value, avatarSrc, selectedRarity, selectedFood);
    }, 2000);
}

// ==========================================
// 5. 資料處理與渲染 (完整顯示版)
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
    loadHistory();
}

function saveToStorage(newRecord) {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch(e) { history = []; }
    
    // 直接插入最前面，不進行任何過濾
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
                // 不比對上一筆，直接全部顯示
                arr.forEach(function(record) {
                    const row = document.createElement('tr');
                    
                    let displayDate = record.fullDate;
                    let displayName = record.username;
                    
                    let avatarUrl = record.avatar || 'https://placehold.co/100x100/ddd/888?text=?';
                    let displayAvatar = `<img src="${avatarUrl}" class="table-avatar">`;

                    let genderIcon = "";
                    if(record.gender === "boy") genderIcon = "♂️";
                    else if(record.gender === "girl") genderIcon = "♀️";
                    else if(record.gender === "other") genderIcon = "🌈";

                    const rarityBadge = `<span class="tag tag-${record.rarity}">${record.rarity}</span>`;
                    
                    let foodStyle = "";
                    if (record.rarity === "SSR") foodStyle = "color: #ff69b4; font-weight:800; text-shadow: 1px 1px 0 #fff;";
                    else if (record.rarity === "SR") foodStyle = "color: #ff9f43; font-weight:800;";

                    row.innerHTML = `
                        <td>${displayAvatar}</td>
                        <td>${rarityBadge}</td>
                        <td>${displayDate}</td>
                        <td>${displayName} ${genderIcon}</td>
                        <td style="${foodStyle}">${record.food}</td>
                    `;
                    
                    resultBody.appendChild(row);
                });
                
                const firstRow = resultBody.querySelector('tr');
                if(firstRow) firstRow.classList.add('new-row');
                return;
            }
        } catch(e) { console.error(e); }
    }
    
    resultBody.innerHTML = '<tr id="placeholderRow"><td colspan="5" class="empty-state">還沒有召喚紀錄捏... ( •̀ ω •́ )✧</td></tr>';
}

drawBtn.addEventListener('click', startGacha);
if(clearBtn) {
    clearBtn.addEventListener('click', function() {
        if(confirm("確定要清除本本嗎？")) {
            localStorage.removeItem(STORAGE_KEY);
            loadHistory();
        }
    });
}