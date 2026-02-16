# Contributing

Terima kasih ketertarikan Anda untuk berkontribusi ke p-man!

## Cara Berkontribusi

### Lapor Bug

Jika Anda menemukan bug:

1. Cek [Issues](https://github.com/galihz/pman/issues) untuk melihat apakah sudah dilaporkan
2. Buat issue baru dengan template bug report
3. Sertakan informasi: versi p-man, versi Node/Bun, OS, dan steps to reproduce

### Request Fitur

Untuk request fitur baru:

1. Cek existing issues untuk menghindari duplikasi
2. Buat issue dengan detail fitur yang diinginkan
3. Jelaskan use case dan mengapa fitur ini berguna

### Pull Request

Untuk mengirim PR:

1. Fork repository
2. Buat branch feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

### Coding Style

- Gunakan TypeScript dengan strict mode
- Ikuti konvensi kode yang sudah ada
- Tambah tests untuk fitur baru
- Update dokumentasi jika perlu

### Commit Message

Gunakan format yang jelas:

```
type: subject

body
```

Type yang umum:
- `feat`: Fitur baru
- `fix`: Fix bug
- `docs`: Perubahan dokumentasi
- `refactor`: Refactoring kode
- `test`: Menambah/memperbaiki tests
- `chore`: Maintenance lainnya

Contoh:
```
feat: add command alias support

Allow commands to have multiple aliases for easier access.
```