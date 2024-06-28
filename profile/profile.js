// profile.js

// Markdown을 HTML로 변환하는 함수
function markdownToHtml(markdown) {
  // 헤더 변환
  markdown = markdown.replace(/^### (.*$)/gim, '<h4 class="markdown-header">$1</h4>');
  markdown = markdown.replace(/^## (.*$)/gim, '<h3 class="markdown-header">$1</h3>');
  markdown = markdown.replace(/^# (.*$)/gim, '<h2 class="markdown-header">$1</h2>');

  // 리스트 변환
  markdown = markdown.replace(/^\* (.*$)/gim, '<li class="markdown-list">$1</li>');
  markdown = markdown.replace(/^\- (.*$)/gim, '<li class="markdown-list">$1</li>');
  markdown = markdown.replace(/^(\d+)\. (.*$)/gim, '<li class="markdown-list">$2</li>');

  // 링크 변환
  markdown = markdown.replace(/\[([^\[]+)\]\(([^\)]+)\)/gim, '<a class="markdown-link" href="$2">$1</a>');

  // 굵은 글씨 변환
  markdown = markdown.replace(/\*\*(.*)\*\*/gim, '<strong class="markdown-bold">$1</strong>');
  markdown = markdown.replace(/\*(.*)\*/gim, '<em class="markdown-italic">$1</em>');

  // 단락 변환
  markdown = markdown.replace(/^\s*(.*)/gm, '<p class="markdown-paragraph">$1</p>');

  return markdown.trim();
}

// 네비게이션 바를 동적으로 생성하는 함수
function createNavigation(markdown) {
  const navItems = markdown.match(/^## (.*$)/gim);
  if (navItems) {
    const navList = navItems.map(item => {
      const sectionName = item.replace(/^## /, '').trim();
      const sectionId = sectionName.toLowerCase().replace(/\s+/g, '');
      return `<li><a href="#${sectionId}">${sectionName}</a></li>`;
    }).join('');

    document.getElementById('sub-nav').innerHTML = navList;
  }
}

// 프로젝트 섹션을 별도로 생성하는 함수
function createProjectSections(markdown) {
  const projects = markdown.split(/^### /gm).slice(1).map(section => {
    const lines = section.split('\n');
    const projectTitle = lines[0].trim();
    const projectContent = lines.slice(1).join('\n').trim();
    const htmlContent = markdownToHtml(projectContent);

    const links = htmlContent.match(/<a class="markdown-link" href="([^"]+)">([^<]+)<\/a>/g);
    const linksHtml = links ? links.map(link => {
      const url = link.match(/href="([^"]+)"/)[1];
      const text = link.match(/">([^<]+)<\/a>/)[1];
      let icon;
      if (text.toLowerCase().includes('github')) {
        icon = '<i class="fab fa-github"></i>';
      } else if (text.toLowerCase().includes('demo')) {
        icon = '<i class="fas fa-external-link-alt"></i>';
      } else {
        icon = '<i class="fas fa-link"></i>';
      }
      return `<a class="project-link" href="${url}">${icon} ${text}</a>`;
    }).join(' ') : '';

    const description = htmlContent.replace(/<a class="markdown-link"[^>]*>[^<]*<\/a>/g, '');

    return `
      <div class="project-card">
        <h4 class="markdown-header">${projectTitle}</h4>
        <div class="markdown-content">
          ${description}
        </div>
        <div class="project-links">
          ${linksHtml}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="project-slider">
      ${projects}
    </div>
    <button class="prev-slide" onclick="prevSlide()">❮</button>
    <button class="next-slide" onclick="nextSlide()">❯</button>
    <div class="slide-indicators"></div>
  `;
}

// 슬라이드 초기화 함수
function initProjectSlider() {
  const slides = document.querySelectorAll('.project-card');
  const indicators = document.querySelector('.slide-indicators');
  let currentIndex = 0;

  slides.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.classList.add('indicator');
    if (index === 0) indicator.classList.add('active');
    indicators.appendChild(indicator);
  });

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
    document.querySelectorAll('.indicator').forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }

  window.prevSlide = function() {
    currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
    showSlide(currentIndex);
  };

  window.nextSlide = function() {
    currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
    showSlide(currentIndex);
  };

  showSlide(currentIndex);
}

// 경험 섹션을 별도로 생성하는 함수
function createExperienceSections(markdown) {
  return markdown.split(/^### /gm).slice(1).map(section => {
    const lines = section.split('\n');
    const experienceTitle = lines[0].trim();
    const experienceContent = lines.slice(1).join('\n').trim();
    const htmlContent = markdownToHtml(experienceContent);

    return `
      <div class="experience-card">
        <h4 class="markdown-header">${experienceTitle}</h4>
        <div class="markdown-content">
          ${htmlContent}
        </div>
      </div>
    `;
  }).join('');
}

// 교육 섹션을 별도로 생성하는 함수
function createEducationSections(markdown) {
  return markdown.split(/^### /gm).slice(1).map(section => {
    const lines = section.split('\n');
    const educationTitle = lines[0].trim();
    const educationContent = lines.slice(1).join('\n').trim();
    const htmlContent = markdownToHtml(educationContent);

    return `
      <div class="education-card">
        <h4 class="markdown-header">${educationTitle}</h4>
        <div class="markdown-content">
          ${htmlContent}
        </div>
      </div>
    `;
  }).join('');
}

// 활동 섹션을 별도로 생성하는 함수
function createActivitySections(markdown) {
  return markdown.split(/^### /gm).slice(1).map(section => {
    const lines = section.split('\n');
    const activityTitle = lines[0].trim();
    const activityContent = lines.slice(1).join('\n').trim();
    const htmlContent = markdownToHtml(activityContent);

    return `
      <div class="activity-card">
        <h4 class="markdown-header">${activityTitle}</h4>
        <div class="markdown-content">
          ${htmlContent}
        </div>
      </div>
    `;
  }).join('');
}

// 스킬 섹션을 별도로 생성하는 함수
function createSkillsSection(markdown) {
  const skillsList = markdown.split(/\n/).map(skill => skill.replace(/^\-\s*/, '').trim());
  const skillsHtml = skillsList.map(skill => {
    let icon;
    switch (skill.toLowerCase()) {
      case 'html':
        icon = '<i class="fab fa-html5"></i>';
        break;
      case 'css':
        icon = '<i class="fab fa-css3-alt"></i>';
        break;
      case 'javascript':
        icon = '<i class="fab fa-js"></i>';
        break;
      case 'react':
        icon = '<i class="fab fa-react"></i>';
        break;
      case 'node.js':
        icon = '<i class="fab fa-node-js"></i>';
        break;
      case 'c':
        icon = '<i class="fas"></i>'; // Assuming using a custom icon for C
        break;
      case 'c++':
        icon = '<i class="fas"></i>'; // Assuming using a custom icon for C++
        break;
      case 'c#':
        icon = '<i class="fab fa-cuttlefish"></i>'; // Not an exact match, but an option
        break;
      case 'java':
        icon = '<i class="fab fa-java"></i>';
        break;
      case 'python':
        icon = '<i class="fab fa-python"></i>';
        break;
      case 'typescript':
        icon = '<i class="fab fa-js-square"></i>'; // There isn't a specific TypeScript icon in FontAwesome
        break;
      case 'pytorch':
        icon = '<i class="fas fa-fire"></i>'; // Not an exact match, but an option
        break;
      case 'tensorflow':
        icon = '<i class="fab fa-tensorflow"></i>';
        break;
      case 'scikit-learn':
        icon = '<i class="fas fa-robot"></i>'; // Not an exact match, but an option
        break;
      case 'spring':
        icon = '<i class="fab fa-java"></i>'; // Using the Java icon as a proxy
        break;
      case 'asp.net':
        icon = '<i class="fas fa-windows"></i>'; // Using Windows icon as a proxy
        break;
      default:
        icon = '<i class="fas"></i>';
        break;
    }
    return `<li class="skill-item">${icon} ${skill}</li>`;
  }).join('');

  return `<ul class="skills-list">${skillsHtml}</ul>`;
}

// 프로필 섹션을 별도로 생성하는 함수
function createProfileSection(markdown) {
  const profileHtml = markdownToHtml(markdown);
  const links = profileHtml.match(/<a class="markdown-link" href="([^"]+)">([^<]+)<\/a>/g);
  const linksHtml = links ? links.map(link => {
    const url = link.match(/href="([^"]+)"/)[1];
    const text = link.match(/">([^<]+)<\/a>/)[1];
    let icon;
    if (text.toLowerCase().includes('linkedin')) {
      icon = '<i class="fab fa-linkedin"></i>';
    } else if (text.toLowerCase().includes('github')) {
      icon = '<i class="fab fa-github"></i>';
    } else if (text.toLowerCase().includes('twitter')) {
      icon = '<i class="fab fa-twitter"></i>';
    } else {
      icon = '<i class="fas fa-link"></i>';
    }
    return `<a class="profile-link" href="${url}">${icon} ${text}</a>`;
  }).join(' ') : '';

  const description = profileHtml.replace(/<a class="markdown-link"[^>]*>[^<]*<\/a>/g, '');

  return `
    <div class="profile-card">
      <div class="markdown-content">
        ${description}
      </div>
      <div class="profile-links">
        ${linksHtml}
      </div>
    </div>
  `;
}

// 섹션을 동적으로 생성하는 함수
function createSections(markdown) {
  const sections = markdown.split(/^## /gm).slice(1);
  sections.forEach(section => {
    const lines = section.split('\n');
    const sectionTitle = lines[0].trim();
    const sectionId = sectionTitle.toLowerCase().replace(/\s+/g, '');
    const sectionContent = lines.slice(1).join('\n').trim();

    let htmlContent;
    if (sectionId === 'projects') {
      htmlContent = createProjectSections(sectionContent);
    } else if (sectionId === 'experience') {
      htmlContent = createExperienceSections(sectionContent);
    } else if (sectionId === 'education') {
      htmlContent = createEducationSections(sectionContent);
    } else if (sectionId === 'extraactivities') {
      htmlContent = createActivitySections(sectionContent);
    } else if (sectionId === 'skills') {
      htmlContent = createSkillsSection(sectionContent);
    } else if (sectionId === 'profile') {
      htmlContent = createProfileSection(sectionContent);
    } else {
      htmlContent = markdownToHtml(sectionContent);
    }

    const sectionHtml = `
      <section id="${sectionId}" class="section">
        <div class="container">
          <h3 class="section-title">${sectionTitle}</h3>
          <div class="markdown-content">
            ${htmlContent}
          </div>
        </div>
      </section>
    `;

    document.getElementById('content').innerHTML += sectionHtml;
  });

  // 프로젝트 슬라이더 초기화
  initProjectSlider();
}

// Markdown 파일을 읽어와서 페이지에 삽입하는 함수
async function loadMarkdown() {
  const response = await fetch('./profile.md');
  const markdown = await response.text();

  // 네비게이션 바 생성
  createNavigation(markdown);

  // 섹션 생성
  createSections(markdown);
}

// DOMContentLoaded 이벤트가 발생하면 loadMarkdown 함수 호출
document.addEventListener('DOMContentLoaded', () => {
  loadMarkdown();
});
