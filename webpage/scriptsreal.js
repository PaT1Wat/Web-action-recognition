document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('.btn.start');
  const stopBtn = document.querySelector('.btn.stop');
  const recordBtn = document.querySelector('.btn.record');
  const tabs = document.querySelectorAll('.log-details .tabs .tab');
  const logList = document.querySelector('.log-list');

  let isMonitoring = false;
  let isRecording = false;
  let logData = [
    { time: '2023-10-27 14:35:12', class: 'ทุจริต', message: 'การเคลื่อนไหวที่น่าสงสัย' },
    { time: '2023-10-27 14:36:01', class: 'ทุจริต', message: 'ตรวจพบวัตถุต้องสงสัย' },
    { time: '2023-10-27 14:37:33', class: 'ทุจริต', message: 'การมองออกนอกจอช้าๆ' },
    { time: '2023-10-27 14:38:05', class: 'ไม่ทุจริต', message: 'กิจกรรมปกติ' }
  ];
  let filter = 'ทั้งหมด';

  // ฟังก์ชันแสดง log ตาม filter
  function renderLogs() {
    logList.innerHTML = '';
    let filteredLogs = logData;
    if (filter === 'ทุจริต') {
      filteredLogs = logData.filter(log => log.class === 'ทุจริต');
    } else if (filter === 'ไม่ทุจริต') {
      filteredLogs = logData.filter(log => log.class === 'ไม่ทุจริต');
    }
    filteredLogs.forEach(log => {
      const li = document.createElement('li');
      const tag = document.createElement('span');
      tag.classList.add('tag');
      if(log.class === 'ทุจริต') tag.classList.add('red');
      tag.textContent = log.class;
      const msg = document.createElement('span');
      msg.textContent = log.message;
      const time = document.createElement('time');
      time.setAttribute('datetime', log.time.replace(' ', 'T'));
      time.textContent = log.time + ' น.';
      li.appendChild(tag);
      li.appendChild(msg);
      li.appendChild(time);
      logList.appendChild(li);
    });
  }

  // ฟังก์ชันเปลี่ยนแท็บ
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filter = tab.textContent.trim();
      renderLogs();
    });
  });

  // ฟังก์ชันจำลองเพิ่มข้อมูล log แบบเรียลไทม์
  function addRandomLog() {
    const now = new Date();
    const timeStr = now.toISOString().slice(0,19).replace('T',' ');
    const classes = ['ทุจริต', 'ไม่ทุจริต'];
    const messages = {
      'ทุจริต': [
        'พบการทำทุจริตเพิ่มขึ้น',
        'ตรวจจับพฤติกรรมสงสัย',
        'พบวัตถุต้องสงสัยในห้องสอบ'
      ],
      'ไม่ทุจริต': [
        'พฤติกรรมปกติ',
        'ไม่มีสิ่งผิดปกติ',
        'กิจกรรมปกติ'
      ]
    };
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const msgOptions = messages[randomClass];
    const randomMsg = msgOptions[Math.floor(Math.random() * msgOptions.length)];

    logData.push({ time: timeStr, class: randomClass, message: randomMsg });

    // Limit log length to last 50 items
    if (logData.length > 50) {
      logData.shift();
    }

    renderLogs();
  }

  // เริ่มจับภาพ / รับข้อมูล
  startBtn.addEventListener('click', () => {
    if (!isMonitoring) {
      isMonitoring = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      recordBtn.disabled = false;
      startBtn.classList.add('disabled');
      stopBtn.classList.remove('disabled');
      recordBtn.classList.remove('disabled');

      // เริ่มรันจำลองการเพิ่ม log ทุก 5 วินาที
      window.logInterval = setInterval(addRandomLog, 5000);
    }
  });

  // หยุดการจับภาพ / รับข้อมูล
  stopBtn.addEventListener('click', () => {
    if (isMonitoring) {
      isMonitoring = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      recordBtn.disabled = true;
      startBtn.classList.remove('disabled');
      stopBtn.classList.add('disabled');
      recordBtn.classList.add('disabled');

      if (window.logInterval) {
        clearInterval(window.logInterval);
      }
    }
  });

  // เริ่ม/หยุดบันทึก
  recordBtn.addEventListener('click', () => {
    if (!isRecording) {
      isRecording = true;
      recordBtn.classList.add('active');
      recordBtn.textContent = 'หยุดบันทึก';
      // คุณสามารถเพิ่มโค้ดเริ่มบันทึกที่นี่
    } else {
      isRecording = false;
      recordBtn.classList.remove('active');
      recordBtn.textContent = 'บันทึก';
      // คุณสามารถเพิ่มโค้ดหยุดบันทึกที่นี่
    }
  });

  // เริ่มต้นสถานะปุ่ม
  stopBtn.disabled = true;
  recordBtn.disabled = true;

  // แสดง log เริ่มต้น
  renderLogs();
});