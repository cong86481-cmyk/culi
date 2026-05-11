-- ============================================
-- SEED DATA FOR CFL MARKETPLACE
-- Run this in Supabase SQL Editor
-- ============================================

-- Clear existing data first (optional - only if you want fresh start)
-- DELETE FROM "MysteryBoxOpening";
-- DELETE FROM "MysteryBoxItem";
-- DELETE FROM "MysteryBox";
-- DELETE FROM "Purchase";
-- DELETE FROM "Deposit";
-- DELETE FROM "Transaction";
-- DELETE FROM "Account";
-- DELETE FROM "Category";
-- DELETE FROM "User";
-- DELETE FROM "Setting";
-- DELETE FROM "Banner";
-- DELETE FROM "PasswordReset";
-- DELETE FROM "MysteryBoxAccount";

-- ============================================
-- USERS (bcrypt hash of passwords)
-- admin123, demo123, user123 (all with cost factor 12)
-- ============================================

INSERT INTO "User" (id, username, email, password, role, balance, "transferNote", "createdAt", "updatedAt")
VALUES 
  ('u-admin-001', 'AdminCFL', 'admin@cfl.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.xA1x3Hq8.H7KQS', 'ADMIN', 10000000, 'CFLADMIN001', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, username, email, password, role, balance, "transferNote", "createdAt", "updatedAt")
VALUES 
  ('u-demo-001', 'DemoGamer', 'demo@cfl.vn', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER', 500000, 'CFLDEMO001', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, username, email, password, role, balance, "transferNote", "createdAt", "updatedAt")
VALUES 
  ('u-gamer1-001', 'GamerVN2024', 'gamer1@cfl.vn', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER', 200000, 'CFLABC123', NOW(), NOW()),
  ('u-gamer2-001', 'CFProPlayer', 'gamer2@cfl.vn', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER', 1500000, 'CFLDEF456', NOW(), NOW()),
  ('u-gamer3-001', 'LegendHunter', 'gamer3@cfl.vn', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER', 3000000, 'CFLGHI789', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO "Category" (id, name, slug) VALUES
  ('cat-rank-thap', 'Rank Thấp', 'rank-thap'),
  ('cat-rank-cao', 'Rank Cao', 'rank-cao'),
  ('cat-vvip', 'VVIP Account', 'vvip-account'),
  ('cat-moi', 'Tài Khoản Mới', 'tai-khoan-moi')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ACCOUNTS
-- ============================================

INSERT INTO "Account" (id, title, price, rank, "vipLevel", "vipGuns", "legendaryGuns", skins, characters, backpack, description, thumbnail, images, username, password, status, featured, "soldCount", "categoryId", "createdAt", "updatedAt")
VALUES 
  ('acc-001', 'Account VIP 5 - Rank Chiến Thần - 15 Vũ Khí Huyền Thoại', 2500000, 'Chiến Thần', 5, 8, 15, 45, '["Captain", "Shadow", "Ghost", "Phoenix", "Viper"]', '["AK-47 Dragon", "AWP Galaxy", "Desert Eagle Gold", "MP5 Neon"]', 'Account VIP 5 cực kỳ xịn xò với 15 vũ khí huyền thoại, 8 vũ khí VVIP, rank Chiến Thần. Tài khoản đã được nạp tiền đầy đủ, có nhiều skin hiếm và characters đẹp.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop', '["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop"]', 'vip5champion', 'Vip2024Pass!', 'AVAILABLE', true, 0, 'cat-vvip', NOW(), NOW()),

  ('acc-002', 'Tài Khoản Rank Bạch Kim - 5 Vũ Khí VVIP', 850000, 'Bạch Kim', 3, 5, 8, 20, '["Storm", "Blaze"]', '["M4A1 Thunder", "AWP Lightning"]', 'Tài khoản rank Bạch Kim với 5 vũ khí VVIP, phù hợp cho game thủ muốn leo rank nhanh.', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop', '["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop"]', 'platinumhero', 'Platinum123!', 'AVAILABLE', true, 0, 'cat-rank-cao', NOW(), NOW()),

  ('acc-003', 'Account VIP 3 - Rank Cao Thủ - 10 Skin Hiếm', 1500000, 'Cao Thủ', 3, 6, 10, 35, '["Dragon", "Phoenix", "Tiger"]', '["AK-47 Fire", "AWP Lava", "Glock Neon"]', 'Account VIP 3 rank Cao Thủ với bộ sưu tập skin cực kỳ đẹp.', 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop', '["https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop"]', 'eliteplayer', 'Elite2024!', 'AVAILABLE', true, 0, 'cat-rank-cao', NOW(), NOW()),

  ('acc-004', 'Tài Khoản Mới Tạo - Rank Đồng - 2 VVIP Guns', 150000, 'Đồng', 1, 2, 3, 8, '["Rookie"]', '["Knife Basic"]', 'Tài khoản mới tạo, rank Đồng, phù hợp cho người mới chơi.', 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=800&h=600&fit=crop', '[]', 'newbievn', 'Newbie123!', 'AVAILABLE', false, 0, 'cat-moi', NOW(), NOW()),

  ('acc-005', 'Account VIP 4 - Rank Kim Cương - Collection Hoàn Chỉnh', 1800000, 'Kim Cương', 4, 7, 12, 40, '["Shadow", "Phoenix", "Wolf", "Eagle"]', '["AK-47 Carbon", "AWP Safari", "Desert Eagle Silver"]', 'Account VIP 4 rank Kim Cương với bộ sưu tập vũ khí hoàn chỉnh.', 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=600&fit=crop', '["https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=600&fit=crop"]', 'diamondking', 'Diamond2024!', 'AVAILABLE', true, 0, 'cat-rank-cao', NOW(), NOW()),

  ('acc-006', 'Tài Khoản Rank Vàng - VIP 2 - 4 VVIP Guns', 450000, 'Vàng', 2, 4, 6, 15, '["Soldier", "Ranger"]', '["M4A1 Sniper", "AWP Forest"]', 'Tài khoản rank Vàng với VIP 2, có 4 vũ khí VVIP.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop', '[]', 'goldengamer', 'Golden123!', 'AVAILABLE', false, 0, 'cat-rank-cao', NOW(), NOW()),

  ('acc-007', 'Account Vàng - Tài Khoản Giá Rẻ - Đã Nạp Tiền', 200000, 'Vàng', 1, 1, 2, 5, '["Warrior"]', '["Pistol Default"]', 'Tài khoản rank Vàng giá rẻ, đã nạp tiền.', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop', '[]', 'cheapacc01', 'Cheap123!', 'AVAILABLE', false, 0, 'cat-rank-thap', NOW(), NOW()),

  ('acc-008', 'Account Thách Đấu - VIP 7 Max - Đỉnh Cao', 5500000, 'Thách Đấu', 7, 15, 25, 80, '["Legend", "Champion", "Master", "Grandmaster", "Top1"]', '["All VVIP Weapons", "All Legendary Weapons", "Exclusive Skins"]', 'Đỉnh của đỉnh! Account VIP 7 Max rank Thách Đấu.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop', '["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop"]', 'toplegend2024', 'TopLegend123!', 'AVAILABLE', true, 0, 'cat-vvip', NOW(), NOW()),

  ('acc-009', 'Account Bạc - Mới Tạo - Giá Cực Rẻ', 80000, 'Bạc', 0, 0, 1, 2, '["Newbie"]', '[]', 'Tài khoản mới tạo, rank Bạc, giá cực rẻ.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop', '[]', 'silvernew', 'Silver123!', 'AVAILABLE', false, 0, 'cat-moi', NOW(), NOW()),

  ('acc-010', 'Tài Khoản Kim Cương - VIP 5 - Bộ Sưu Tập Đẹp', 2200000, 'Kim Cương', 5, 10, 18, 50, '["Phantom", "Reaper", "Knight", "Paladin"]', '["AK-47 Dragon", "AWP Galaxy", "M4A1 Cyber", "Desert Eagle Gold"]', 'Account VIP 5 rank Kim Cương với bộ sưu tập vũ khí đẹp nhất.', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop', '["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=600&fit=crop"]', 'diamondcollex', 'Collex2024!', 'AVAILABLE', true, 0, 'cat-vvip', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- SETTINGS
-- ============================================

INSERT INTO "Setting" (id, key, value) VALUES
  ('set-001', 'website_name', 'CFL Marketplace'),
  ('set-002', 'website_description', 'Nền tảng mua bán tài khoản CrossFire Legends uy tín số 1 Việt Nam'),
  ('set-003', 'bank_name', 'Vietcombank'),
  ('set-004', 'bank_account', '1032888290'),
  ('set-005', 'bank_holder', 'CFL MARKETPLACE'),
  ('set-006', 'minimum_deposit', '10000'),
  ('set-007', 'contact_email', 'support@cfl-market.vn'),
  ('set-008', 'contact_phone', '0901 234 567')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- MYSTERY BOX
-- ============================================

INSERT INTO "MysteryBox" (id, name, slug, description, image, price, discount, stock, status, "createdAt", "updatedAt")
VALUES 
  ('box-001', 'Túi Mù 399K', 'tui-mu-399k', 'Nhận ngay tài khoản CrossFire với giá 399K! Thông tin tài khoản sẽ hiện khi trúng.', NULL, 399000, 0, -1, 'ACTIVE', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VERIFY DATA
-- ============================================

SELECT 'Users:' as table_name, COUNT(*) as count FROM "User"
UNION ALL SELECT 'Categories:', COUNT(*) FROM "Category"
UNION ALL SELECT 'Accounts:', COUNT(*) FROM "Account"
UNION ALL SELECT 'Settings:', COUNT(*) FROM "Setting"
UNION ALL SELECT 'MysteryBoxes:', COUNT(*) FROM "MysteryBox";
