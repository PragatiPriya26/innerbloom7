 5000
npx kill-port 5000
# Kill port 3000
npx kill-port 3000
```

**npm install fails?**
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

**Browser doesn't open automatically?**
```bash
# Just go to:
http://localhost:3000
```

**Backend not connecting?**
- Make sure backend is running first (Terminal 1)
- Check that `"proxy": "http://localhost:5000"` is in `frontend/package.json`
- The app works offline too — it has local fallbacks for all API calls

---

Built with 💚 for InnerBloom Hackathon 2025
