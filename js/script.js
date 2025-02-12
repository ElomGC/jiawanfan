document.addEventListener('DOMContentLoaded', function() {
  // ====================================
  // 画廊内容加载功能
  // ====================================
  const gallery = document.getElementById('pixiv-gallery');
  const loadingMessage = document.getElementById('loading-message');
  // 阿里云函数计算 HTTP 触发器 URL
  const apiUrl = 'https://pixivfetcher-amgqdnhdxg.cn-beijing.fcapp.run';
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Fetched data:", data);
      let illustData = [];
      if (data.body) {
        if (data.body.illust && data.body.illust.data) {
          illustData = illustData.concat(data.body.illust.data);
        }
        if (data.body.illustManga && data.body.illustManga.data) {
          illustData = illustData.concat(data.body.illustManga.data);
        }
      } else {
        if (data.illust && data.illust.data) {
          illustData = data.illust.data;
        }
      }
      
      if (illustData.length === 0) {
        gallery.innerHTML = '<p>暂无画廊内容</p>';
        return;
      }
      
      if (loadingMessage) {
        loadingMessage.style.display = 'none';
      }
      
      // 随机排序后取前 6 项
      illustData.sort(() => 0.5 - Math.random());
      const selected = illustData.slice(0, 6);
      // 使用图片代理服务：显示的图片 URL 域名为 pixiv.re，而点击时跳转至 pixiv.net
      const proxyDomain = 'pixiv.re';
      
      selected.forEach(item => {
        const id = item.id;
        const pageCount = item.pageCount || item.illust_page_count || 1;
        const page = (pageCount > 1) ? Math.floor(Math.random() * pageCount) + 1 : null;
        const pagePart = page ? '-' + page : '';
        const imageUrl = `https://${proxyDomain}/${id}${pagePart}.jpg`;
        const targetUrl = `https://www.pixiv.net/artworks/${id}`;
        
        const a = document.createElement('a');
        a.href = imageUrl;
        a.addEventListener('click', function(event) {
          event.preventDefault();
          window.open(targetUrl, '_blank');
        });
        
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.style.backgroundImage = `url('${imageUrl}')`;
        
        a.appendChild(div);
        gallery.appendChild(a);
      });
    })
    .catch(error => {
      console.error('加载画廊内容时出错：', error);
      gallery.innerHTML = '<center>加载画廊内容时出错，请稍后重试。</center>';
    });

  // ====================================
  // 随机句子功能
  // ====================================
  const sentences = [
    "可最后 我才发现 你是甜美闯入我心房",
    "到最后 我才发现 遇见你 我变得真正开朗",
    "可今天 我又发现 你的甜美每天都不重样",
    "到今天 我又发现 嘉然默默陪在你我身旁",
    "请来一束追光照进你心里",
    "水母同样拥有自己的魅力",
    "愿你放下压力笑着做自己",
    "顶碗人和我会一直陪着你"
  ];
  const sentenceElement = document.getElementById('random-sentence');
  function getRandomSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
  }
  if (sentenceElement) {
    sentenceElement.textContent = getRandomSentence();
    setInterval(() => {
      sentenceElement.textContent = getRandomSentence();
    }, 5000);
  }

  // ====================================
  // 随机选择精选切片视频功能（从外部 JSON 文件加载 BV 号）
  // ====================================
  // 从 videoBvids.json 文件加载视频 BV 号列表
  fetch('videoBvids.json')
    .then(response => response.json())
    .then(videoBvids => {
      // videoBvids 应该是一个数组
      // 随机打乱数组
      videoBvids.sort(() => 0.5 - Math.random());
      // 取前 4 个视频（若不足 4 项则全部显示）
      const selectedVideos = videoBvids.slice(0, 4);
      
      // 获取放置视频的容器
      const videoContainer = document.getElementById("random-videos");
      videoContainer.innerHTML = '';  // 清空容器内容
      
      selectedVideos.forEach((bvid, index) => {
        const videoDiv = document.createElement("div");
        videoDiv.className = "video-container";
        
        const iframe = document.createElement("iframe");
        iframe.src = `//player.bilibili.com/player.html?bvid=${bvid}`;
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "");
        
        videoDiv.appendChild(iframe);
        videoContainer.appendChild(videoDiv);
        
        // 保持原来的换行格式：如果不是最后一个视频，则插入 <br>
        if (index < selectedVideos.length - 1) {
          videoContainer.appendChild(document.createElement("br"));
        }
      });
    })
    .catch(error => {
      console.error('加载视频 BV 号失败：', error);
    });
});
