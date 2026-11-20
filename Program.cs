using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var dataFilePath = Path.Combine(app.Environment.ContentRootPath, "data.json");
var uploadsDir = Path.Combine(app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot"), "uploads");
Directory.CreateDirectory(uploadsDir);

var jsonOptions = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true,
    WriteIndented = true
};

AppData LoadData()
{
    if (!File.Exists(dataFilePath)) return new AppData();
    try
    {
        return JsonSerializer.Deserialize<AppData>(File.ReadAllText(dataFilePath), jsonOptions) ?? new AppData();
    }
    catch { return new AppData(); }
}

void SaveData(AppData data)
{
    File.WriteAllText(dataFilePath, JsonSerializer.Serialize(data, jsonOptions));
}

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
    }
});

app.MapGet("/api/data", () => Results.Ok(LoadData()));

app.MapPost("/api/data", (AppData updatedData) =>
{
    var existing = LoadData();
    foreach (var kv in updatedData.RawStorage)
    {
        existing.RawStorage[kv.Key] = kv.Value;
    }
    SaveData(existing);
    return Results.Ok(existing);
});

app.MapPost("/api/upload-base64", async (UploadBase64Request req) =>
{
    if (string.IsNullOrWhiteSpace(req.Base64Data))
        return Results.BadRequest(new { error = "Empty image data" });

    var raw = req.Base64Data;
    var ext = ".jpg";
    if (raw.StartsWith("data:image/png", StringComparison.OrdinalIgnoreCase)) ext = ".png";
    else if (raw.StartsWith("data:image/webp", StringComparison.OrdinalIgnoreCase)) ext = ".webp";
    else if (raw.StartsWith("data:image/gif", StringComparison.OrdinalIgnoreCase)) ext = ".gif";

    var commaIdx = raw.IndexOf(',');
    if (commaIdx >= 0) raw = raw[(commaIdx + 1)..];

    byte[] bytes;
    try { bytes = Convert.FromBase64String(raw); }
    catch { return Results.BadRequest(new { error = "Invalid base64 image" }); }

    var fileName = $"{Guid.NewGuid()}{ext}";
    await File.WriteAllBytesAsync(Path.Combine(uploadsDir, fileName), bytes);
    return Results.Ok(new { url = $"/uploads/{fileName}" });
});

app.Run();

public class AppData
{
    public Dictionary<string, string> RawStorage { get; set; } = new();
}

public class UploadBase64Request
{
    public string Base64Data { get; set; } = string.Empty;
}