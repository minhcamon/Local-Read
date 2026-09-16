export interface MockBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  progressPercent: number;
  currentPage: number;
  totalPages: number;
  category: 'reading' | 'finished' | 'saved';
  estimatedReadTimeMinutes: number;
  currentChapter: string;
  partTitle: string;
  description: string;
}

export interface NoteItem {
  id: string;
  bookId: string;
  pageNumber: number;
  chapter: string;
  highlightedText: string;
  userNote?: string;
  createdAt: string;
  tag?: string;
}

export interface DefinitionItem {
  term: string;
  definition: string;
  contextExcerpt: string;
  etymologyOrNote?: string;
}

export interface TocChapter {
  id: string;
  title: string;
  page: number;
  subsections?: { id: string; title: string; page: number }[];
}

export const MOCK_BOOKS: MockBook[] = [
  {
    id: 'sapiens',
    title: 'Sapiens: Lược sử loài người',
    author: 'Yuval Noah Harari',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFpZQvkMJlrGW5MB-wmb1SHRrnbEGAt6wTpxJUYUta8SNxGm4QjNS5NFDAamuJit3lN0EH6i54hbETslN213ykn8aUtrcG3MOt90giIRX9ZWmIkokzOJR3-3_wfB5iwVX7A_e8GzZbo44lye5ijHdPnYABMF8Wgt7Sy9APfLSFlnc9SQNdPAmgowAtE6HBQV1bp_n9YiKi5-LSp71KaotXdUmnLpzFWHYFpAGfB6__-F3CTI4-Uyda',
    progressPercent: 65,
    currentPage: 312,
    totalPages: 480,
    category: 'reading',
    estimatedReadTimeMinutes: 45,
    currentChapter: 'Chương 12: Quy luật của tôn giáo',
    partTitle: 'Phần Ba: Sự thống nhất của nhân loại',
    description: 'Một cái nhìn toàn cảnh sâu sắc về hành trình tiến hóa của giống loài Homo Sapiens từ động vật vô danh đến kẻ thống trị Trái Đất.'
  },
  {
    id: 'thinking-fast-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZZwtJB862ubDi-xpTiP0rBS4Uw1EBRXjcCpROijGB1Am6FROZo0dj92ARVT-yAYwpE5b5Gqh3tfhXhK96x-jTrx2lMzB8oTvBhUPxdnilyBgs9uE7ZUDh8EtVBkMIwAPiRb50JgfMDlor37yWAiv8RLXVkNpy8iEwSa8gSn3xWJP-ija2DSxJI-cRSWdwRIE5mE-hFjhyi-xqIc3ekkGW0Vc5CzbLumrgRLCOxvhOgyQkx7lgm6Qw',
    progressPercent: 30,
    currentPage: 150,
    totalPages: 500,
    category: 'reading',
    estimatedReadTimeMinutes: 25,
    currentChapter: 'Chương 5: Cỗ máy liên tưởng',
    partTitle: 'Phần Một: Hai hệ thống tư duy',
    description: 'Cuộc khám phá đột phá về hai hệ thống điều khiển cách chúng ta suy nghĩ: Hệ thống 1 nhanh, cảm tính; Hệ thống 2 chậm, lý trí.'
  },
  {
    id: 'deep-work',
    title: 'Deep Work: Focused Success',
    author: 'Cal Newport',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJXSswCWhAEXP1y3HvrksJwBwPX1MIY3q47kuTt1O-0cO-Ex_2PRPqBxrPePO6lyDssySohTK2eEYJ2jV_a0IfGfK_oTKhoujTq0mt2l-kPl439yUutAEZiETboXFHNwZF86iYGKbe-NUEiq1JEH-GPSd-zUbPHgksf7N0FJX0RjQIsWKGER6OKGMxTMEDZLksA4CqttUjuaeOrb4QLlOLmHTDcvNbLq1RdQf2LUVbtbn3R93bvQ7Z',
    progressPercent: 80,
    currentPage: 240,
    totalPages: 300,
    category: 'reading',
    estimatedReadTimeMinutes: 18,
    currentChapter: 'Quy tắc 3: Thoát khỏi mạng xã hội',
    partTitle: 'Các quy tắc thực hành',
    description: 'Nghệ thuật tập trung cao độ không xao nhãng trong một thế giới tràn ngập thông tin hỗn loạn.'
  },
  {
    id: 'the-selfish-gene',
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGagE0EXDZQWZDlmP2fG2PPz0wCS7xmflEtrx9orSu5CD1p3eOvz36qVnheRFMSDe108RykESmgkxFd7ZqIDDcVcrF4sXicTiKfB11YenRIQkV-ymsHr_OtksZAB-YdWVysn13VZ9PdWue6zXyaO6hW8hg857uPjWXhJ0h_LEH2i0d-k3pUEMW94ovtOCrqoK_RjxnzpbtGg8m1E0xa05cYjKIGZuYNH-RaR9prdgWUhu87br9gWyG',
    progressPercent: 0,
    currentPage: 0,
    totalPages: 360,
    category: 'saved',
    estimatedReadTimeMinutes: 0,
    currentChapter: 'Lời tựa',
    partTitle: 'Khởi đầu',
    description: 'Tác phẩm kinh điển về tiến hóa luận sinh học, đặt gene làm trung tâm của quá trình chọn lọc tự nhiên.'
  },
  {
    id: 'klara-and-the-sun',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXgSeVg9OLB6x16EMFLYN2rsv9SamuZyMzB28C-XPWKivvUcy6Uly0UGyeZq5f-2L8ZFfHmjTOMetdWcR3R1NUuR6I1Cj3NiRSyrdzo5_Q-jHLalD2S7xC0YySfb95yEuXUc7aspZF15HRfQYZU2CGXN7roTkXbxYA3ChGkAPYF1oxMGyndF9GBsC4JDqozvmUAbhsFSE8bF3U_ceVhJtacIG432bn8B4yTxSIkKd2jSFEhfPK04GJ',
    progressPercent: 45,
    currentPage: 48,
    totalPages: 307,
    category: 'reading',
    estimatedReadTimeMinutes: 35,
    currentChapter: 'Chương 3: Cửa Hiệu và Ánh Sáng',
    partTitle: 'Phần Một • Mặt Trời và Cửa Hiệu',
    description: 'Tiểu thuyết ấm áp và cảm động của tác giả đoạt giải Nobel Kazuo Ishiguro, kể qua lăng kính của Klara — một Người Bạn Nhân Tạo (AF).'
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjEvtvQabI5OgMxkh3a-1He9uTKqxJV2yPLciNI-bXxvuTkTPIwVl3ahE6oUgjIzr1VQ0f7w4l7x3qSkWYOT9c0wialTCIk7TkTM6__E_vGtkmFEuAI04FaGtAltSBpcILzqAz8mgiFzTzQA2YiZsDosBuAJZmGEaOC2VDNGVkjHkUe0MzQxTG1VG_0Ry9GPkVeS7t2CGvx5w5riS6PcZUpkRhFxPEuF-KUPTmejL_1_garkF_0zI',
    progressPercent: 90,
    currentPage: 288,
    totalPages: 320,
    category: 'reading',
    estimatedReadTimeMinutes: 12,
    currentChapter: 'Chương 20: Mặt trái của việc tạo thói quen tốt',
    partTitle: 'Chiến thuật nâng cao',
    description: 'Phương pháp khoa học xây dựng thói quen tốt và từ bỏ thói quen xấu thông qua những cải tiến 1% mỗi ngày.'
  },
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm3XA8VyAPcUCUBY3WLMU2SdeZG-WTG8zGDEVIcTBOoKDt1frEUgy-eeDeeT8JHrBs_CteOf8IBuiauG6taRVqGZ2OxdwkfNgac6-xy7GUf1DDuxi-aZ0yrcrPUyGnTCAoJ1-p5N5xhPvPiK11MyTIdsGswPWAxfLhDwI7JX1uEsgTcN2x5YwAedV979T_gO5z1jULsdHQ0j646BHR5fVwXPR1grNztvxfM84kiPdMdFdSFCVYpFpH',
    progressPercent: 100,
    currentPage: 200,
    totalPages: 200,
    category: 'finished',
    estimatedReadTimeMinutes: 0,
    currentChapter: 'Quyển XII',
    partTitle: 'Suy tưởng cuối cùng',
    description: 'Những ghi chép nội tâm sâu sắc về triết học Khắc kỷ của vị hoàng đế La Mã vĩ đại.'
  }
];

export const MOCK_TOC: TocChapter[] = [
  { id: 'p1-c1', title: 'Phần Một • Khung Cửa Sổ Phía Trước', page: 1 },
  { id: 'p1-c2', title: 'Phần Một • Những Người Bạn Nhân Tạo', page: 24 },
  { id: 'p1-c3', title: 'Phần Một • Cửa Hiệu và Ánh Sáng', page: 48 },
  { id: 'p2-c1', title: 'Phần Hai • Ngôi Nhà ở Vùng Quê', page: 85 },
  { id: 'p2-c2', title: 'Phần Hai • Josie và Rick', page: 120 },
  { id: 'p3-c1', title: 'Phần Ba • Chuyến Đi Thành Phố', page: 172 },
  { id: 'p4-c1', title: 'Phần Bốn • Buổi Chiều ở Kho Thóc', page: 230 },
  { id: 'p5-c1', title: 'Phần Năm • Bãi Phế Liệu', page: 285 },
];

export const MOCK_NOTES: NoteItem[] = [
  {
    id: 'n1',
    bookId: 'klara-and-the-sun',
    pageNumber: 48,
    chapter: 'Chương 3',
    highlightedText: 'Mặt Trời luôn có cách vươn tới chúng tôi, dù cho những tòa nhà cao tầng và các cỗ máy Cootings có xả khói mù mịt đến đâu.',
    userNote: 'Hình tượng Mặt Trời ở đây không chỉ là nguồn quang năng đơn thuần cho Klara, mà biểu trưng cho niềm tin thuần khiết và sự che chở tinh thần.',
    createdAt: '14:20 • Hôm nay',
    tag: 'Biểu tượng'
  },
  {
    id: 'n2',
    bookId: 'klara-and-the-sun',
    pageNumber: 49,
    chapter: 'Chương 3',
    highlightedText: 'Người ta thường mang trong mình những khoang cảm xúc bị niêm phong, và họ sợ hãi việc phải mở chúng ra ngay cả với người thân nhất.',
    userNote: 'Quan sát tinh tế của Klara về sự cô đơn và nỗi sợ tổn thương của con người trong xã hội hiện đại được nâng cấp gen.',
    createdAt: '10:15 • Hôm qua',
    tag: 'Tâm lý'
  }
];

export const MOCK_DEFINITIONS: DefinitionItem[] = [
  {
    term: 'AF (Artificial Friend)',
    definition: 'Người Bạn Nhân Tạo — Dòng robot đồng hành thông minh được tạo ra để bầu bạn và hỗ trợ trẻ em vị thành niên được nâng cấp (lifted) học tập tại nhà.',
    contextExcerpt: 'Quản lý cửa hiệu giải thích rằng các mẫu AF dòng B2 như Klara có khả năng thấu cảm và quan sát đặc biệt nhạy bén.',
    etymologyOrNote: 'Khái niệm trung tâm trong tác phẩm của Kazuo Ishiguro.'
  },
  {
    term: 'Cootings Machine',
    definition: 'Cỗ máy thi công phát thải lượng khói ô nhiễm lớn trên đường phố, đại diện cho mặt tối của nền công nghiệp và sự che khuất ánh sáng Mặt Trời.',
    contextExcerpt: 'Cỗ máy Cootings đỗ ngay góc phố, phả từng cột khói xám xịt làm gián đoạn dòng dưỡng chất từ Mặt Trời.',
    etymologyOrNote: 'Tên hư cấu trong tiểu thuyết.'
  },
  {
    term: 'Lifted (Nâng cấp gen)',
    definition: 'Quá trình chỉnh sửa gen cao cấp dành cho trẻ em nhằm gia tăng trí tuệ và cơ hội vào đại học danh giá, song tiềm ẩn rủi ro sức khỏe nghiêm trọng.',
    contextExcerpt: 'Josie là một đứa trẻ đã qua nâng cấp nhưng cơ thể em thường xuyên bị suy nhược.',
    etymologyOrNote: 'Phản ánh sự phân hóa giai cấp công nghệ sinh học.'
  }
];

export const MOCK_SAVED_QUOTES = [
  {
    id: 'q1',
    text: 'Trái tim con người phức tạp đến mức không ai có thể lập bản đồ toàn bộ các phòng chứa trong đó.',
    author: 'Kazuo Ishiguro',
    page: 49
  },
  {
    id: 'q2',
    text: 'Có những ngày ánh nắng đổ xuống như một tấm chăn ấm mềm, xua tan mọi giá lạnh tích tụ trong gầm máy.',
    author: 'Klara',
    page: 48
  }
];

export const SAMPLE_READING_CONTENT_PAGE_1 = {
  chapterNumber: 'Chương 3',
  chapterTitle: 'Cửa Hiệu và Ánh Sáng',
  leadParagraph: 'Khi người quản lý chuyển tôi lên vị trí ô cửa kính phía trước, thế giới bên ngoài bỗng mở rộng ra với hàng trăm sắc độ chuyển động mà trước đó tôi chỉ được chiêm ngưỡng qua lời kể của Rosa.',
  paragraphs: [
    'Mặt Trời luôn có cách vươn tới chúng tôi, dù cho những tòa nhà cao tầng và các cỗ máy Cootings có xả khói mù mịt đến đâu. Mỗi sớm mai, khi những dải quang năng đầu tiên rọi qua lớp kính dày và chạm vào lồng ngực tôi, tôi cảm nhận rõ ràng dòng năng lượng ấm áp đang lan tỏa khắp các mạch dẫn, như một lời chào bình an bắt đầu một ngày mới.',
    'Từ vị trí ô cửa kính, tôi học cách quan sát con người. Họ bước đi vội vã trên vỉa hè với chiếc túi xách kẹp chặt bên sườn, ánh mắt họ hướng về những điểm vô hình phía xa. Đôi khi, một người đàn ông đi taxi bỗng dừng lại bên mép đường, nhìn lên bầu trời với vẻ mặt đăm chiêu, rồi lại cúi đầu lướt tiếp trên thiết bị phát sáng cầm tay.',
    'Người quản lý nói với tôi: "Klara, em có đôi mắt biết nhìn sâu hơn hầu hết các AF khác. Đừng chỉ nhìn chuyển động, hãy nhìn vào cách họ giữ khoảng cách với nhau." Và tôi đã làm đúng như lời bà dạy. Tôi nhận ra rằng ngay cả khi hai người sóng đôi cạnh nhau, giữa họ vẫn tồn tại một khoảng chân không vô hình, dường như người ta thường mang trong mình những khoang cảm xúc bị niêm phong, và họ sợ hãi việc phải mở chúng ra ngay cả với người thân nhất.'
  ]
};

export const SAMPLE_READING_CONTENT_PAGE_2 = {
  chapterNumber: 'Chương 3 (tiếp theo)',
  chapterTitle: 'Gặp Gỡ Josie',
  leadParagraph: 'Chính vào buổi chiều thứ Năm của tuần thứ hai bên cửa kính, lần đầu tiên tôi nhìn thấy Josie.',
  paragraphs: [
    'Em đứng bên ngoài lớp kính trong chiếc áo khoác len màu hạt dẻ, mái tóc hơi rối buông xõa ngang vai. Bước chân của em có phần ngập ngừng và nghiêng nhẹ về bên trái — dấu hiệu của một thể trạng không hoàn toàn khỏe mạnh, nhưng đôi mắt em thì sáng rực một sự tò mò lạ lùng.',
    'Em nhìn thẳng vào tôi, không phải cái nhìn soi xét như người ta đánh giá một món hàng công nghệ, mà là cái nhìn tìm kiếm một người bạn có thể lắng nghe. Em giơ bàn tay nhỏ nhắn lên áp vào mặt kính lành lạnh, và theo một phản xạ tự nhiên nhất, tôi cũng nâng bàn tay mình lên, đặt khớp với vị trí bàn tay em qua làn thủy tinh trong suốt.',
    '"Chào bạn," khẩu hình miệng của Josie mấp máy sau lớp kính. Dù không nghe được âm thanh, tôi hiểu trọn vẹn từng âm tiết. Và trong khoảnh khắc ấy, tôi biết rằng Mặt Trời đã dẫn lối cho sự gặp gỡ này, định hình toàn bộ những ngày tháng phía trước của tôi.'
  ]
};
