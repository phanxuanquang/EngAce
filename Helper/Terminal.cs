namespace Helper
{
    public static class Terminal
    {
        public static void Println(string text, ConsoleColor color = ConsoleColor.Green)
        {
            System.Console.ForegroundColor = color;
            System.Console.WriteLine(text);
            System.Console.ResetColor();
        }
    }
}
