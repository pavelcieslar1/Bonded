namespace Bonded.Services.External
{
    public class GeminiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GeminiClient(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = "AIzaSyAjuj3iYzCpYryAdC_gYTQt3FwLaqNNhg0";
        }

        public async Task<string> GenerateSummaryAsync(string prompt)
        {
            var request = new
            {
                contents = new[] {
                new {
                    parts = new[] {
                        new { text = prompt }
                    }
                }
            }
            };

            var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + _apiKey)
            {
                Content = JsonContent.Create(request)
            };

            var response = await _httpClient.SendAsync(httpRequest);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<GeminiResponse>();
            return result?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text ?? "";
        }

        private class GeminiResponse
        {
            public List<Candidate> candidates { get; set; }

            public class Candidate
            {
                public Content content { get; set; }
            }

            public class Content
            {
                public List<Part> parts { get; set; }
            }

            public class Part
            {
                public string text { get; set; }
            }
        }
    }

}
