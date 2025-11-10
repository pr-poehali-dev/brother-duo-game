import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: number;
  title: string;
  image: string;
  time: string;
  difficulty: string;
  category: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const recipes: Recipe[] = [
    {
      id: 1,
      title: 'Паста Карбонара',
      image: 'https://cdn.poehali.dev/projects/9c6a889a-5a92-4de1-8238-c5da71033257/files/7468c85a-4868-4876-8d66-8258002e4486.jpg',
      time: '30 мин',
      difficulty: 'Средне',
      category: 'Основное блюдо'
    },
    {
      id: 2,
      title: 'Свежий салат',
      image: 'https://cdn.poehali.dev/projects/9c6a889a-5a92-4de1-8238-c5da71033257/files/0a1937ee-53c7-4566-80e4-d0fb521ecd55.jpg',
      time: '15 мин',
      difficulty: 'Легко',
      category: 'Салаты'
    },
    {
      id: 3,
      title: 'Овощное рагу',
      image: 'https://cdn.poehali.dev/projects/9c6a889a-5a92-4de1-8238-c5da71033257/files/6b394fd5-1473-4d86-992c-df24ce84a618.jpg',
      time: '45 мин',
      difficulty: 'Средне',
      category: 'Основное блюдо'
    }
  ];

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/190854ee-6fa9-4798-9189-2f22ad626de3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });

      if (!response.ok) throw new Error('Ошибка ответа от ИИ');

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить ответ от ИИ-помощника',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-orange-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="ChefHat" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold text-primary">Кулинарный помощник</h1>
            </div>
            <Button variant="outline" size="icon">
              <Icon name="User" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="recipes" className="text-lg">
              <Icon name="BookOpen" className="mr-2" size={20} />
              Рецепты
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-lg">
              <Icon name="MessageCircle" className="mr-2" size={20} />
              ИИ-помощник
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            <div className="mb-6">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Поиск рецептов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="text-xl">{recipe.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        {recipe.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="TrendingUp" size={16} />
                        {recipe.difficulty}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Icon name="Eye" className="mr-2" size={18} />
                      Смотреть рецепт
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Search" className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-xl text-muted-foreground">Рецепты не найдены</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" className="text-primary" size={24} />
                  Спроси у ИИ-шефа
                </CardTitle>
                <CardDescription>
                  Задай любой вопрос о готовке, замене ингредиентов или попроси рецепт
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <Icon name="MessageCircle" className="mx-auto text-muted-foreground mb-4" size={48} />
                      <p className="text-muted-foreground">Начни разговор с ИИ-помощником</p>
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <Icon name="Loader" className="animate-spin" size={20} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Напиши сообщение..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;