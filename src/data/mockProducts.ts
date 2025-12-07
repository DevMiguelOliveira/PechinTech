import { Product } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Placa de Vídeo RTX 4070 Super 12GB GDDR6X',
    description: 'A GeForce RTX 4070 SUPER oferece desempenho de ray tracing e DLSS 3 para jogos com alta taxa de quadros.',
    image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
    current_price: 3299.99,
    original_price: 4199.99,
    affiliate_url: 'https://example.com/rtx4070',
    category: 'hardware',
    temperature: 85,
    hot_votes: 342,
    cold_votes: 28,
    comments_count: 67,
    store: 'Kabum',
    created_at: new Date().toISOString(),
    specs: {
      'Memória': '12GB GDDR6X',
      'Interface': 'PCIe 4.0 x16',
      'Boost Clock': '2475 MHz',
      'TDP': '220W'
    }
  },
  {
    id: '2',
    title: 'Monitor Gamer 27" 165Hz IPS 1ms',
    description: 'Monitor gamer com painel IPS, 165Hz de taxa de atualização e tempo de resposta de 1ms.',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    current_price: 1299.99,
    original_price: 1899.99,
    affiliate_url: 'https://example.com/monitor',
    category: 'monitors',
    temperature: 72,
    hot_votes: 156,
    cold_votes: 12,
    comments_count: 34,
    store: 'Pichau',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    specs: {
      'Resolução': '2560x1440 (QHD)',
      'Taxa de Atualização': '165Hz',
      'Tempo de Resposta': '1ms GTG',
      'Painel': 'IPS'
    }
  },
  {
    id: '3',
    title: 'Teclado Mecânico RGB Switch Blue',
    description: 'Teclado mecânico com switches blue, iluminação RGB e construção em alumínio.',
    image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=300&fit=crop',
    current_price: 249.99,
    original_price: 399.99,
    affiliate_url: 'https://example.com/teclado',
    category: 'peripherals',
    temperature: 68,
    hot_votes: 89,
    cold_votes: 8,
    comments_count: 22,
    store: 'Terabyte',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    specs: {
      'Switch': 'Blue (Clicky)',
      'Layout': 'ABNT2',
      'Iluminação': 'RGB por tecla',
      'Conexão': 'USB-C'
    }
  },
  {
    id: '4',
    title: 'SSD NVMe 1TB PCIe 4.0 7000MB/s',
    description: 'SSD NVMe de alta performance com velocidades de leitura de até 7000MB/s.',
    image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
    current_price: 449.99,
    original_price: 699.99,
    affiliate_url: 'https://example.com/ssd',
    category: 'hardware',
    temperature: 91,
    hot_votes: 423,
    cold_votes: 15,
    comments_count: 89,
    store: 'Kabum',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    specs: {
      'Capacidade': '1TB',
      'Interface': 'PCIe 4.0 x4 NVMe',
      'Leitura': '7000 MB/s',
      'Escrita': '5500 MB/s'
    }
  },
  {
    id: '5',
    title: 'Mouse Gamer Wireless 25000 DPI',
    description: 'Mouse gamer wireless com sensor de 25000 DPI, bateria de longa duração e RGB.',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    current_price: 299.99,
    original_price: 449.99,
    affiliate_url: 'https://example.com/mouse',
    category: 'peripherals',
    temperature: 54,
    hot_votes: 67,
    cold_votes: 23,
    comments_count: 18,
    store: 'Pichau',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    specs: {
      'DPI': '25000',
      'Bateria': 'Até 70 horas',
      'Peso': '63g',
      'Polling Rate': '1000Hz'
    }
  },
  {
    id: '6',
    title: 'Headset Gamer 7.1 Surround USB',
    description: 'Headset gamer com som surround 7.1, microfone retrátil e almofadas de espuma memory foam.',
    image_url: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop',
    current_price: 399.99,
    original_price: 549.99,
    affiliate_url: 'https://example.com/headset',
    category: 'peripherals',
    temperature: 45,
    hot_votes: 45,
    cold_votes: 32,
    comments_count: 15,
    store: 'Terabyte',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    specs: {
      'Som': '7.1 Surround Virtual',
      'Driver': '50mm',
      'Microfone': 'Retrátil com cancelamento de ruído',
      'Conexão': 'USB'
    }
  },
  {
    id: '7',
    title: 'Processador Ryzen 7 7800X3D AM5',
    description: 'O melhor processador para gaming com 3D V-Cache, 8 núcleos e 16 threads.',
    image_url: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop',
    current_price: 2199.99,
    original_price: 2799.99,
    affiliate_url: 'https://example.com/ryzen',
    category: 'hardware',
    temperature: 95,
    hot_votes: 567,
    cold_votes: 12,
    comments_count: 134,
    store: 'Kabum',
    created_at: new Date(Date.now() - 900000).toISOString(),
    specs: {
      'Núcleos': '8',
      'Threads': '16',
      'Cache L3': '96MB (3D V-Cache)',
      'TDP': '120W'
    }
  },
  {
    id: '8',
    title: 'Cadeira Gamer Ergonômica Reclinável',
    description: 'Cadeira gamer com apoio lombar, reclinação de 180° e almofadas ajustáveis.',
    image_url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=300&fit=crop',
    current_price: 899.99,
    original_price: 1299.99,
    affiliate_url: 'https://example.com/cadeira',
    category: 'peripherals',
    temperature: 38,
    hot_votes: 34,
    cold_votes: 28,
    comments_count: 8,
    store: 'Pichau',
    created_at: new Date(Date.now() - 18000000).toISOString(),
    specs: {
      'Reclinação': 'Até 180°',
      'Peso Suportado': 'Até 150kg',
      'Material': 'Couro sintético premium',
      'Apoio de Braço': '4D ajustável'
    }
  },
];

export const categories = [
  { id: 'hardware', name: 'Hardware', icon: 'Cpu' },
  { id: 'peripherals', name: 'Periféricos', icon: 'Mouse' },
  { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone' },
  { id: 'games', name: 'Games', icon: 'Gamepad2' },
  { id: 'monitors', name: 'Monitores', icon: 'Monitor' },
  { id: 'notebooks', name: 'Notebooks', icon: 'Laptop' },
] as const;
