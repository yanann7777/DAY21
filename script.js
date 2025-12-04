// ==========================================
// 1. 吉伊卡哇角色與美食資料
// ==========================================
console.log("1. 程式開始載入...");

const chiikawaChars = [
    { id: 'chiikawa', name: '小可愛', color: '#FFFFFF', image: 'https://placehold.co/100x100/FFFFFF/FF69B4?text=小可愛' },
    { id: 'hachi', name: '小八', color: '#87CEEB', image: 'https://placehold.co/100x100/87CEEB/FFFFFF?text=小八' },
    { id: 'usagi', name: '兔兔', color: '#FFFACD', image: 'https://placehold.co/100x100/FFFACD/DAA520?text=兔兔' },
    { id: 'momonga', name: '小桃', color: '#E0FFFF', image: 'https://placehold.co/100x100/E0FFFF/008080?text=小桃' },
    { id: 'kurimanju', name: '栗子', color: '#DEB887', image: 'https://placehold.co/100x100/DEB887/8B4513?text=栗子' },
    { id: 'rakko', name: '海獺', color: '#8B4513', image: 'https://placehold.co/100x100/8B4513/FFFFFF?text=海獺' },
    { id: 'anoko', name: '那孩子', color: '#D3D3D3', image: 'https://placehold.co/100x100/D3D3D3/000000?text=那孩子' }
];

const poolSSR = ["頂級和牛丼飯", "龍蝦沙拉三明治", "蒲燒鰻魚飯定食", "松露野菇燉飯", "特級海陸大餐", "Prime等級牛排飯", "豪華綜合生魚片丼"];
const poolSR = ["日式鹽烤鯖魚", "舒肥雞胸肉波基碗", "泰式打拋豬(正宗)", "花雕雞腿定食", "清蒸鱸魚套餐", "紅燒牛腱飯", "日式炸豬排(腰內肉)", "鮭魚排佐時蔬", "韓式石鍋拌飯", "越式生牛肉河粉", "香煎干貝義大利麵", "海南雞飯(腿肉)"];
const poolN = ["便利商店: 雞胸肉組合", "便利商店: 鮪魚飯糰", "傻瓜乾麵", "水餃10顆", "榨菜肉絲麵", "陽春麵+滷蛋", "潤餅", "Subway 6吋潛艇堡", "雞肉飯便當", "排骨飯", "蛋炒飯", "皮蛋瘦肉粥", "麻醬麵", "控肉飯", "米粉湯+黑白切", "關東煮組合", "肉圓+貢丸湯", "大腸包小腸", "涼麵+味噌湯", "自助餐(三菜一肉)"];

// ==========================================
// 2. 初始化與變數
// ==========================================
const drawBtn = document.getElementById('drawBtn');
const clearBtn = document.getElementById('clearBtn');
const resultBody = document.getElementById('resultBody');
const overlay = document.getElementById('gachaOverlay');
const avatarGrid = document.getElementById('avatarGrid');
const STORAGE_KEY = 'gacha_lunch_chiikawa_v3'; // 使用新 Key 確保乾淨

console.log("2. 變數初始化完成");

// 頁面載入執行
window.addEventListener('load', function() {
    console.log("3. 頁面載入事件觸發");
    initAvatars(); 
    loadHistory(); 
});

// ==========================================
// 3. 頭貼選擇邏輯
// ==========================================
function initAvatars() {
    if (!avatarGrid) {
        console.error("錯誤：找不到 avatarGrid 元素！請檢查 HTML id='avatarGrid' 是否存在");
        return;
    }
    console.log("4. 開始產生大頭貼選項");
    avatarGrid.innerHTML = '';
    
    chiikawaChars.forEach(function(char, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'avatar-wrapper';
        
        const img = document.createElement('img');
        img.src = char.image;
        img.className = 'avatar-option';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = char.name;
        nameSpan.className = 'avatar-name';

        if (index === 0) {
            wrapper.classList.add('selected');
            const hiddenInput = document.getElementById('selectedAvatar');
            if(hiddenInput) hiddenInput.value = char.image;
        }

        wrapper.addEventListener('click', function() {
            document.querySelectorAll('.avatar-wrapper').forEach(function(el) {
                el.classList.remove('selected');
            });
            wrapper.classList.add('selected');
            const hiddenInput = document.getElementById('selectedAvatar');
            if(hiddenInput) hiddenInput.value = char.image;
            console.log("已選擇角色:", char.name);
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
    console.log("按鈕被點擊！開始抽卡流程");
    const nameInput = document.getElementById('username').value;
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const avatarSrc = document.getElementById('selectedAvatar').value;

    if (nameInput.trim() === "") {
        alert("請輸入召喚師名字！");
        return;
    }

    drawBtn.disabled = true;
    overlay.classList.remove('hidden');
    
    const rand = Math.random() * 100;
    let selectedFood = "", selectedRarity = "";

    if (rand >= 95) { 
        selectedRarity = "SSR"; selectedFood = poolSSR[Math.floor(Math.random() * poolSSR.length)];
    } else if (rand >= 70) { 
        selectedRarity = "SR"; selectedFood = poolSR[Math.floor(Math.random() * poolSR.length)];
    } else {
        selectedRarity = "N"; selectedFood = poolN[Math.floor(Math.random() * poolN.length)];
    }

    setTimeout(function() {
        console.log("動畫結束，準備顯示結果");
        overlay.classList.add('hidden');
        drawBtn.disabled = false;
        
        handleData(nameInput, genderInput ? genderInput.value : 'boy', avatarSrc, selectedRarity, selectedFood);
    }, 2000);
}

// ==========================================
// 5. 資料處理與渲染
// ==========================================
function handleData(name, gender, avatar, rarity, food) {
    console.log("處理資料中:", name, food);
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
    
    history.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    console.log("資料已儲存到 LocalStorage");
}

function loadHistory() {
    console.log("開始讀取歷史紀錄");
    if (!resultBody) {
        console.error("錯誤：找不到 resultBody 表格！請檢查 HTML id='resultBody'");
        return;
    }
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    resultBody.innerHTML = ''; 

    if (savedData) {
        try {
            const arr = JSON.parse(savedData);
            if (arr.length > 0) {
                arr.forEach(function(record) {
                    const row = document.createElement('tr');
                    
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
                        <td>${record.fullDate}</td>
                        <td>${record.username} ${genderIcon}</td>
                        <td style="${foodStyle}">${record.food}</td>
                    `;
                    resultBody.appendChild(row);
                });
                
                const firstRow = resultBody.querySelector('tr');
                if(firstRow) firstRow.classList.add('new-row');
                return;
            }
        } catch(e) { console.error("讀取紀錄發生錯誤:", e); }
    }
    
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
} else { console.error("找不到清除按鈕"); }

if(drawBtn) {
    drawBtn.addEventListener('click', startGacha);
} else { console.error("找不到抽卡按鈕"); }