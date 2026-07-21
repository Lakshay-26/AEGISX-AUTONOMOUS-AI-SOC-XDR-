document.addEventListener('DOMContentLoaded', () => {
    const defaultAccounts = [
        {
            name: 'Alex Vance',
            email: 'commander@aegisx-cyber.io',
            password: 'AegisX@2026!',
            role: 'Lead SOC Commander',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        }
    ];

    let registeredUsers = JSON.parse(localStorage.getItem('aegisx_registered_users'));
    if (!registeredUsers || !Array.isArray(registeredUsers) || registeredUsers.length === 0) {
        registeredUsers = defaultAccounts;
        localStorage.setItem('aegisx_registered_users', JSON.stringify(registeredUsers));
    }

    const state = {
        theme: localStorage.getItem('aegisx_theme') || 'dark',
        user: JSON.parse(localStorage.getItem('aegisx_user')) || null,
        registeredUsers: registeredUsers,
        authMode: 'login',
        timelineData: [110, 145, 120, 210, 280, 195, 240, 340, 270, 320, 410, 394],
        vectorCounts: {
            'IAM Leaks': 35,
            'SQLi': 25,
            'Deception Trapped': 20,
            'XSS': 12,
            'DDoS': 8
        },
        logs: [
            {
                id: 'evt-7092',
                timestamp: '2026-07-21 15:20:00',
                severity: 'critical',
                vector: 'Leaked AWS IAM Key & Ransomware Probe',
                sourceIP: '185.220.101.14',
                location: 'Frankfurt, Germany (DE)',
                target: 's3://prod-vault-bucket/api',
                action: 'IAM KEY REVOKED BY SOAR',
                mitre: 'T1078 - Valid Credentials Misuse',
                payload: 'GET /s3/prod-vault-bucket/api HTTP/1.1\nHost: aws.aegisx-cyber.io\nUser-Agent: Boto3/1.26.0 (Leaked-Key-Scanner)\nAuthorization: AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE/20260721...\n\n[SOAR TRIGGERED: Key AKIAIOSFODNN7EXAMPLE revoked at AWS API Level]'
            },
            {
                id: 'evt-7091',
                timestamp: '2026-07-21 15:12:05',
                severity: 'high',
                vector: 'Deception Trap: SSH Honeypot Intrusion',
                sourceIP: '103.251.170.99',
                location: 'Singapore (SG)',
                target: 'ssh://honey-node-04.aegisx.internal:22',
                action: 'TRAPPED & PROFILED IN SANDBOX',
                mitre: 'T1110 - Brute Force Credentials',
                payload: 'SSH-2.0-OpenSSH_8.9p1\nAttempted Root Login: root / p@ssw0rd123!\nCaptured Attacker Session Keystrokes logged to Deception Sandbox.'
            },
            {
                id: 'evt-7090',
                timestamp: '2026-07-21 15:01:44',
                severity: 'critical',
                vector: 'Kubernetes Container Escape Attempt',
                sourceIP: '194.26.29.112',
                location: 'Bucharest, Romania (RO)',
                target: 'k8s://pod-auth-service-7f9b/ns',
                action: 'CONTAINER ISOLATED BY SOAR',
                mitre: 'T1611 - Escape to Host',
                payload: 'POST /api/v1/namespaces/default/pods/exec HTTP/1.1\nUser-Agent: kubectl-exploit-v1.4\nAttempted mounting host IPC namespace /proc/sys/kernel.'
            },
            {
                id: 'evt-7089',
                timestamp: '2026-07-21 14:48:30',
                severity: 'medium',
                vector: 'Deception Trap: S3 Bucket Enumeration',
                sourceIP: '45.155.205.88',
                location: 'Amsterdam, Netherlands (NL)',
                target: 's3://honey-customer-data-backup',
                action: 'LOGGED & FAKE PAYLOAD SERVED',
                mitre: 'T1530 - Data from Cloud Storage',
                payload: 'GET /honey-customer-data-backup?list-type=2 HTTP/1.1\nHost: s3.amazonaws.com\nUser-Agent: AWS-CLI/2.9.0 (Deception Trap Triggered)'
            },
            {
                id: 'evt-7088',
                timestamp: '2026-07-21 14:30:19',
                severity: 'critical',
                vector: 'Volumetric SYN Flood DDoS Attack',
                sourceIP: 'Distributed Swarm (3,120 IPs)',
                location: 'Global Botnet Swarm',
                target: 'Ingress Load Balancer Cluster #1',
                action: 'MITIGATED BY BGP SCRUBBING',
                mitre: 'T1498 - Network Denial of Service',
                payload: 'Ingress bandwidth spiked to 24.5 Gbps (5.4M pps SYN flood targeting TCP 443)'
            }
        ]
    };

    const elements = {
        html: document.documentElement,
        body: document.body,
        themeToggle: document.getElementById('themeToggle'),
        themeIcon: document.getElementById('themeIcon'),
        
        dashboardContainer: document.getElementById('dashboardContainer'),
        loginBtn: document.getElementById('loginBtn'),
        profileTrigger: document.getElementById('profileTrigger'),
        navAvatar: document.getElementById('navAvatar'),
        navUserName: document.getElementById('navUserName'),
        navUserRole: document.getElementById('navUserRole'),
        
        greetingHeading: document.getElementById('greetingHeading'),
        
        authModal: document.getElementById('authModal'),
        closeAuthModal: document.getElementById('closeAuthModal'),
        tabLogin: document.getElementById('tabLogin'),
        tabRegister: document.getElementById('tabRegister'),
        authForm: document.getElementById('authForm'),
        authErrorMsg: document.getElementById('authErrorMsg'),
        authErrorText: document.getElementById('authErrorText'),
        groupName: document.getElementById('groupName'),
        groupRole: document.getElementById('groupRole'),
        authModalTitle: document.getElementById('authModalTitle'),
        authSubmitBtn: document.getElementById('authSubmitBtn'),
        inputName: document.getElementById('inputName'),
        inputEmail: document.getElementById('inputEmail'),
        inputPassword: document.getElementById('inputPassword'),
        selectRole: document.getElementById('selectRole'),

        passStrengthContainer: document.getElementById('passStrengthContainer'),
        strengthBarFill: document.getElementById('strengthBarFill'),
        strengthLabel: document.getElementById('strengthLabel'),
        strengthScore: document.getElementById('strengthScore'),

        detailModal: document.getElementById('detailModal'),
        closeDetailModal: document.getElementById('closeDetailModal'),
        modalSeverity: document.getElementById('modalSeverity'),
        modalThreatTitle: document.getElementById('modalThreatTitle'),
        modalTimestamp: document.getElementById('modalTimestamp'),
        modalSourceIP: document.getElementById('modalSourceIP'),
        modalLocation: document.getElementById('modalLocation'),
        modalTarget: document.getElementById('modalTarget'),
        modalMitre: document.getElementById('modalMitre'),
        modalAction: document.getElementById('modalAction'),
        modalPayload: document.getElementById('modalPayload'),
        soarRevokeKeyBtn: document.getElementById('soarRevokeKeyBtn'),
        soarBlockBtn: document.getElementById('soarBlockBtn'),
        soarIsolateBtn: document.getElementById('soarIsolateBtn'),
        soarDownloadBtn: document.getElementById('soarDownloadBtn'),

        profileModal: document.getElementById('profileModal'),
        closeProfileModal: document.getElementById('closeProfileModal'),
        modalProfileAvatar: document.getElementById('modalProfileAvatar'),
        modalProfileName: document.getElementById('modalProfileName'),
        modalProfileRole: document.getElementById('modalProfileRole'),
        modalProfileEmail: document.getElementById('modalProfileEmail'),
        profileInputName: document.getElementById('profileInputName'),
        profileInputEmail: document.getElementById('profileInputEmail'),
        profileSelectRole: document.getElementById('profileSelectRole'),
        profileInputPassword: document.getElementById('profileInputPassword'),
        profileEditForm: document.getElementById('profileEditForm'),
        logoutBtn: document.getElementById('logoutBtn'),
        topSignoutBtn: document.getElementById('topSignoutBtn'),
        generateApiKeyBtn: document.getElementById('generateApiKeyBtn'),
        apiKeyList: document.getElementById('apiKeyList'),

        historyTableBody: document.getElementById('historyTableBody'),
        logSearch: document.getElementById('logSearch'),
        severityFilter: document.getElementById('severityFilter'),

        timelineCanvas: document.getElementById('timelineChart'),
        vectorCanvas: document.getElementById('vectorChart'),

        exportReportBtn: document.getElementById('exportReportBtn'),
        triggerScanBtn: document.getElementById('triggerScanBtn')
    };

    function showToast(message, type = 'success') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.style.cssText = `
            background: var(--bg-surface);
            color: var(--text-heading);
            border: 1px solid ${type === 'danger' ? 'var(--color-danger)' : 'var(--color-cyan)'};
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `<i class="fa-solid ${type === 'danger' ? 'fa-triangle-exclamation' : 'fa-circle-check'}" style="color:${type === 'danger' ? 'var(--color-danger)' : 'var(--color-cyan)'}"></i> ${message}`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    function showAuthError(msg) {
        if (elements.authErrorMsg) {
            elements.authErrorText.textContent = msg;
            elements.authErrorMsg.classList.remove('hidden');
        }
    }

    function hideAuthError() {
        if (elements.authErrorMsg) {
            elements.authErrorMsg.classList.add('hidden');
        }
    }

    function evaluatePasswordStrength(password) {
        if (!password) return { score: 0, label: 'None', color: '#ef4444', width: '0%' };

        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

        switch (score) {
            case 1:
                return { score: 1, label: 'Weak (Vulnerable)', color: '#ef4444', width: '25%' };
            case 2:
                return { score: 2, label: 'Moderate (Acceptable)', color: '#f59e0b', width: '50%' };
            case 3:
                return { score: 3, label: 'Strong (Secure)', color: '#10b981', width: '75%' };
            case 4:
                return { score: 4, label: 'Cyber-Grade Fortress', color: '#00e5ff', width: '100%' };
            default:
                return { score: 0, label: 'Too Short', color: '#ef4444', width: '10%' };
        }
    }

    function initPasswordMeter() {
        elements.inputPassword.addEventListener('input', () => {
            const val = elements.inputPassword.value;
            if (val.length > 0) {
                elements.passStrengthContainer.classList.remove('hidden');
                const strength = evaluatePasswordStrength(val);
                elements.strengthBarFill.style.width = strength.width;
                elements.strengthBarFill.style.backgroundColor = strength.color;
                elements.strengthLabel.textContent = `Strength: ${strength.label}`;
                elements.strengthLabel.style.color = strength.color;
                elements.strengthScore.textContent = `${strength.score}/4`;
            } else {
                elements.passStrengthContainer.classList.add('hidden');
            }
        });
    }

    function initTheme() {
        applyTheme(state.theme);
        elements.themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('aegisx_theme', state.theme);
            applyTheme(state.theme);
            if (state.user) renderCharts();
        });
    }

    function applyTheme(theme) {
        elements.html.setAttribute('data-theme', theme);
        elements.body.className = `theme-${theme}`;
        elements.themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    function handleSignOut() {
        state.user = null;
        localStorage.removeItem('aegisx_user');
        updateUserUI();
        closeModal(elements.profileModal);
        showToast('Signed out of AegisX. Access locked.', 'info');
    }

    function initUserSession() {
        updateUserUI();

        if (elements.loginBtn) elements.loginBtn.addEventListener('click', () => openAuthModal('login'));
        elements.profileTrigger.addEventListener('click', () => openProfileModal());

        if (elements.logoutBtn) elements.logoutBtn.addEventListener('click', handleSignOut);
        if (elements.topSignoutBtn) elements.topSignoutBtn.addEventListener('click', handleSignOut);

        elements.tabLogin.addEventListener('click', () => switchAuthTab('login'));
        elements.tabRegister.addEventListener('click', () => switchAuthTab('register'));

        elements.authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            hideAuthError();

            const emailOrUser = elements.inputEmail.value.trim().toLowerCase();
            const password = elements.inputPassword.value;
            const inputName = elements.inputName.value.trim();

            if (state.authMode === 'register') {
                if (!inputName) {
                    showAuthError('Please enter a unique username!');
                    return;
                }

                const existingName = state.registeredUsers.find(u => u.name.toLowerCase() === inputName.toLowerCase());
                if (existingName) {
                    showAuthError(`Username "${inputName}" is already taken! Please choose a unique username.`);
                    return;
                }

                const existingEmail = state.registeredUsers.find(u => u.email.toLowerCase() === emailOrUser);
                if (existingEmail) {
                    showAuthError(`Email "${emailOrUser}" is already registered! Please sign in.`);
                    return;
                }

                if (password.length < 6) {
                    showAuthError('Password must be at least 6 characters long!');
                    return;
                }

                const newUser = {
                    name: inputName,
                    email: emailOrUser.includes('@') ? emailOrUser : `${inputName.toLowerCase().replace(/\s+/g, '')}@aegisx-cyber.io`,
                    password: password,
                    role: elements.selectRole.value,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                };

                state.registeredUsers.push(newUser);
                localStorage.setItem('aegisx_registered_users', JSON.stringify(state.registeredUsers));

                state.user = {
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    avatar: newUser.avatar
                };

                localStorage.setItem('aegisx_user', JSON.stringify(state.user));
                updateUserUI();
                closeModal(elements.authModal);
                showToast(`Commander account "${newUser.name}" registered successfully!`);
                setTimeout(renderCharts, 100);

            } else {
                const foundUser = state.registeredUsers.find(u => 
                    (u.email.toLowerCase() === emailOrUser || u.name.toLowerCase() === emailOrUser) && 
                    u.password === password
                );

                if (!foundUser) {
                    showAuthError('Incorrect details! Invalid username/email or passcode.');
                    return;
                }

                state.user = {
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role,
                    avatar: foundUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                };

                localStorage.setItem('aegisx_user', JSON.stringify(state.user));
                updateUserUI();
                closeModal(elements.authModal);
                showToast(`Authenticated as ${state.user.name} (${state.user.role})`);
                setTimeout(renderCharts, 100);
            }
        });

        const presetImages = document.querySelectorAll('.avatar-option');
        presetImages.forEach(img => {
            img.addEventListener('click', () => {
                presetImages.forEach(i => i.classList.remove('active'));
                img.classList.add('active');
                const newAvatarUrl = img.getAttribute('data-src');
                elements.modalProfileAvatar.src = newAvatarUrl;
                if (state.user) {
                    state.user.avatar = newAvatarUrl;
                    const foundInDb = state.registeredUsers.find(u => u.email === state.user.email);
                    if (foundInDb) {
                        foundInDb.avatar = newAvatarUrl;
                        localStorage.setItem('aegisx_registered_users', JSON.stringify(state.registeredUsers));
                    }
                }
            });
        });

        if (elements.profileEditForm) {
            elements.profileEditForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!state.user) return;

                const newName = elements.profileInputName.value.trim();
                const newEmail = elements.profileInputEmail.value.trim();

                const existingName = state.registeredUsers.find(u => u.name.toLowerCase() === newName.toLowerCase() && u.email !== state.user.email);
                if (existingName) {
                    showToast(`Username "${newName}" is taken by another user!`, 'danger');
                    return;
                }

                state.user.name = newName;
                state.user.email = newEmail;
                state.user.role = elements.profileSelectRole.value;

                const foundInDb = state.registeredUsers.find(u => u.email === state.user.email || u.name === state.user.name);
                if (foundInDb) {
                    foundInDb.name = state.user.name;
                    foundInDb.email = state.user.email;
                    foundInDb.role = state.user.role;
                    if (elements.profileInputPassword.value.trim() !== '') {
                        foundInDb.password = elements.profileInputPassword.value.trim();
                    }
                    localStorage.setItem('aegisx_registered_users', JSON.stringify(state.registeredUsers));
                }

                if (elements.profileInputPassword.value.trim() !== '') {
                    showToast('Security passcode updated successfully.');
                    elements.profileInputPassword.value = '';
                }

                localStorage.setItem('aegisx_user', JSON.stringify(state.user));
                updateUserUI();
                openProfileModal();
                showToast('User profile settings & avatar updated!');
            });
        }

        if (elements.closeAuthModal) {
            elements.closeAuthModal.addEventListener('click', () => {
                if (state.user) closeModal(elements.authModal);
            });
        }
        elements.closeDetailModal.addEventListener('click', () => closeModal(elements.detailModal));
        elements.closeProfileModal.addEventListener('click', () => closeModal(elements.profileModal));

        [elements.detailModal, elements.profileModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        });

        elements.authModal.addEventListener('click', (e) => {
            if (e.target === elements.authModal && state.user) {
                closeModal(elements.authModal);
            }
        });
    }

    function updateUserUI() {
        if (state.user) {
            elements.dashboardContainer.classList.remove('hidden');
            elements.authModal.classList.add('hidden');
            elements.navUserName.textContent = state.user.name;
            elements.navUserRole.textContent = state.user.role;
            elements.navAvatar.src = state.user.avatar;
            elements.greetingHeading.textContent = `Welcome back, Commander ${state.user.name.split(' ')[0]}`;
        } else {
            elements.dashboardContainer.classList.add('hidden');
            elements.authModal.classList.remove('hidden');
            if (elements.closeAuthModal) elements.closeAuthModal.classList.add('hidden');
        }
    }

    function openAuthModal(mode) {
        switchAuthTab(mode);
        elements.authModal.classList.remove('hidden');
    }

    function switchAuthTab(mode) {
        state.authMode = mode;
        hideAuthError();
        elements.inputPassword.value = '';
        elements.passStrengthContainer.classList.add('hidden');

        if (mode === 'login') {
            elements.tabLogin.classList.add('active');
            elements.tabRegister.classList.remove('active');
            elements.groupName.classList.add('hidden');
            elements.groupRole.classList.add('hidden');
            elements.authModalTitle.textContent = 'AegisX Security Portal Gateway';
            elements.authSubmitBtn.innerHTML = '<i class="fa-solid fa-shield"></i> Authenticate & Launch Dashboard';
        } else {
            elements.tabRegister.classList.add('active');
            elements.tabLogin.classList.remove('active');
            elements.groupName.classList.remove('hidden');
            elements.groupRole.classList.remove('hidden');
            elements.authModalTitle.textContent = 'Register New SOC Commander';
            elements.authSubmitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account & Grant Access';
        }
    }

    function openProfileModal() {
        if (!state.user) return;
        elements.modalProfileName.textContent = state.user.name;
        elements.modalProfileRole.textContent = state.user.role;
        elements.modalProfileEmail.textContent = state.user.email;
        elements.modalProfileAvatar.src = state.user.avatar;

        elements.profileInputName.value = state.user.name;
        elements.profileInputEmail.value = state.user.email;
        elements.profileSelectRole.value = state.user.role;

        const presetImages = document.querySelectorAll('.avatar-option');
        presetImages.forEach(img => {
            if (img.getAttribute('data-src') === state.user.avatar) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });

        elements.profileModal.classList.remove('hidden');
    }

    function closeModal(modal) {
        modal.classList.add('hidden');
    }

    function renderHistoryTable() {
        const searchTerm = elements.logSearch.value.toLowerCase();
        const severityVal = elements.severityFilter.value;

        const filtered = state.logs.filter(log => {
            const matchesSearch = log.vector.toLowerCase().includes(searchTerm) ||
                                  log.sourceIP.toLowerCase().includes(searchTerm) ||
                                  log.location.toLowerCase().includes(searchTerm);
            const matchesSeverity = severityVal === 'all' || log.severity === severityVal;
            return matchesSearch && matchesSeverity;
        });

        elements.historyTableBody.innerHTML = '';

        filtered.forEach(log => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="mono-text">${log.timestamp}</td>
                <td><span class="severity-badge status-${log.severity}">${log.severity}</span></td>
                <td><strong>${log.vector}</strong></td>
                <td><span class="mono-text">${log.sourceIP}</span> <small style="color:var(--text-muted)">(${log.location})</small></td>
                <td class="mono-text">${log.target}</td>
                <td><span class="status-badge status-blocked">${log.action}</span></td>
                <td><button class="inspect-btn"><i class="fa-solid fa-eye"></i> Inspect</button></td>
            `;
            tr.addEventListener('click', () => openDetailModal(log));
            elements.historyTableBody.appendChild(tr);
        });
    }

    function openDetailModal(log) {
        elements.modalSeverity.textContent = log.severity.toUpperCase();
        elements.modalSeverity.className = `severity-badge status-${log.severity}`;
        elements.modalThreatTitle.textContent = log.vector;
        elements.modalTimestamp.textContent = log.timestamp + ' UTC';
        elements.modalSourceIP.textContent = log.sourceIP;
        elements.modalLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${log.location}`;
        elements.modalTarget.textContent = log.target;
        elements.modalMitre.textContent = log.mitre;
        elements.modalAction.textContent = log.action;
        elements.modalPayload.textContent = log.payload;

        elements.detailModal.classList.remove('hidden');
    }

    function initTableFilters() {
        elements.logSearch.addEventListener('input', renderHistoryTable);
        elements.severityFilter.addEventListener('change', renderHistoryTable);
    }

    function renderCharts() {
        if (!state.user) return;
        drawTimelineChart();
        drawVectorChart();
    }

    function drawTimelineChart() {
        const canvas = elements.timelineCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentNode.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const dataPoints = state.timelineData;
        const padding = 30;
        const w = canvas.width - padding * 2;
        const h = canvas.height - padding * 2;

        const isDark = state.theme === 'dark';
        const strokeColor = isDark ? '#00e5ff' : '#0284c7';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (h / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }

        const stepX = w / (dataPoints.length - 1);
        const maxVal = Math.max(...dataPoints, 450);

        ctx.beginPath();
        dataPoints.forEach((val, i) => {
            const x = padding + i * stepX;
            const y = canvas.height - padding - (val / maxVal) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        const grad = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
        grad.addColorStop(0, isDark ? 'rgba(0, 229, 255, 0.25)' : 'rgba(2, 132, 199, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        dataPoints.forEach((val, i) => {
            const x = padding + i * stepX;
            const y = canvas.height - padding - (val / maxVal) * h;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = strokeColor;
            ctx.fill();
        });
    }

    function drawVectorChart() {
        const canvas = elements.vectorCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentNode.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const colorMap = {
            'IAM Leaks': '#ef4444',
            'SQLi': '#00e5ff',
            'Deception Trapped': '#f59e0b',
            'XSS': '#9d4edd',
            'DDoS': '#10b981'
        };

        const vectors = Object.keys(state.vectorCounts).map(key => ({
            label: key,
            value: state.vectorCounts[key],
            color: colorMap[key] || '#00e5ff'
        }));

        const total = vectors.reduce((acc, v) => acc + v.value, 0);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 - 10;
        const radius = Math.min(centerX, centerY) - 20;

        let startAngle = -Math.PI / 2;

        vectors.forEach(v => {
            const sliceAngle = (v.value / total) * (Math.PI * 2);

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.arc(centerX, centerY, radius * 0.55, startAngle + sliceAngle, startAngle, true);
            ctx.closePath();

            ctx.fillStyle = v.color;
            ctx.shadowColor = v.color;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;

            startAngle += sliceAngle;
        });

        const kpiBlocked = document.getElementById('kpiBlocked');
        const totalCountStr = kpiBlocked ? kpiBlocked.textContent : '3,942';

        ctx.fillStyle = state.theme === 'dark' ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(totalCountStr, centerX, centerY - 6);
        ctx.font = '10px Inter';
        ctx.fillStyle = state.theme === 'dark' ? '#8a99ad' : '#64748b';
        ctx.fillText('LIVE EVENTS', centerX, centerY + 12);
    }

    function exportReportFile() {
        const dateStr = new Date().toISOString().split('T')[0];
        const reportContent = `
================================================================================
               AEGISX EXECUTIVE XDR SECURITY REPORT & COMPLIANCE SUMMARY
================================================================================
Generated On: ${new Date().toUTCString()}
Auditor Analyst: ${state.user ? state.user.name : 'Commander Alex'} (${state.user ? state.user.role : 'Lead SOC Commander'})
Defense Engine Status: OPTIMAL (DEFCON 5)

--------------------------------------------------------------------------------
1. EXECUTIVE SECURITY METRICS OVERVIEW
--------------------------------------------------------------------------------
Total Cyber Attacks Blocked (24h) : ${document.getElementById('kpiBlocked').textContent}
Active Unresolved Anomalies       : 2 (Under Autonomous Isolation)
System Health Index               : 99.9% Optimal
Network Ingress Telemetry Throughput: 8.2 GB/s

--------------------------------------------------------------------------------
2. AEGISX 4 CORE PILLARS HEALTH STATUS
--------------------------------------------------------------------------------
Pillar 1: Unified XDR Telemetry & AI Anomaly Engine ........ ACTIVE (Isolation Forest ML)
Pillar 2: Autonomous SOAR Playbooks Engine ............... ACTIVE (Zero Delay Mitigation)
Pillar 3: Zero-Trust Network Gateway & Identity Proxy ..... COMPLIANT (Posture Passed)
Pillar 4: Deception Mesh & Honeypot Traps ................ ARMED (4 Decoy Nodes Active)

--------------------------------------------------------------------------------
3. MITRE ATT&CK DETECTED THREAT TELEMETRY
--------------------------------------------------------------------------------
T1190 - Initial Access (Exploit Public-Facing Application) ... 6 Detections (Blocked)
T1059 - Execution (Command & Scripting Interpreter) .......... 4 Detections (Blocked)
T1078 - Persistence (Valid Credentials Misuse) .............. 2 Detections (IAM Revoked)
T1027 - Defense Evasion (Obfuscated Files & Payloads) ........ 9 Detections (Quarantined)

--------------------------------------------------------------------------------
4. RECENT INTERCEPTED THREAT LOG SAMPLES
--------------------------------------------------------------------------------
${state.logs.map(log => `[${log.timestamp}] [${log.severity.toUpperCase()}] ${log.vector} | IP: ${log.sourceIP} (${log.location}) -> Target: ${log.target} | Action: ${log.action}`).join('\n')}

================================================================================
Report Sign-Off: AegisX Autonomous Security Operations System v5.4
256-Bit Encrypted Cryptographic Hash: 0x9f823a4b912e87c09d22ff11a87b
================================================================================
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AegisX_Executive_Security_Report_${dateStr}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('AegisX Executive Security Report downloaded successfully!');
    }

    function downloadPcapTelemetry() {
        const pcapDump = `
# AegisX WireShark / PCAP Telemetry Dump v5.4
# Captured Timestamp: ${new Date().toISOString()}
# Source IP: ${elements.modalSourceIP.textContent}
# Target Endpoint: ${elements.modalTarget.textContent}

FRAME 1: 64 bytes on wire (512 bits), 64 bytes captured
Ethernet II, Src: 00:1a:2b:3c:4d:5e, Dst: 00:11:22:33:44:55
Internet Protocol Version 4, Src: ${elements.modalSourceIP.textContent}, Dst: 10.0.4.15
Transmission Control Protocol, Src Port: 54102, Dst Port: 443, Seq: 1, Ack: 1

RAW INTERCEPTED PAYLOAD TELEMETRY:
${elements.modalPayload.textContent}
        `.trim();

        const blob = new Blob([pcapDump], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AegisX_Packet_Capture_${Date.now()}.pcap`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('PCAP Raw Telemetry Dump file downloaded successfully!');
    }

    function initButtons() {
        elements.generateApiKeyBtn.addEventListener('click', () => {
            const randomHex = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
            const keyItem = document.createElement('div');
            keyItem.className = 'api-key-item mt-2';
            keyItem.innerHTML = `
                <div class="api-key-info">
                    <span class="key-name">Generated AegisX Token</span>
                    <span class="key-value mono-text">aegisx_token_${randomHex.substring(0, 10)}****</span>
                </div>
                <button class="btn-sm btn-outline copy-key-btn"><i class="fa-solid fa-copy"></i> Copy</button>
            `;
            elements.apiKeyList.appendChild(keyItem);
            showToast('New AegisX SIEM Token generated successfully!');
        });

        if (elements.soarRevokeKeyBtn) {
            elements.soarRevokeKeyBtn.addEventListener('click', () => {
                showToast('SOAR Playbook: AWS IAM Secret Key revoked at Cloud API Level.', 'danger');
                closeModal(elements.detailModal);
            });
        }

        elements.soarBlockBtn.addEventListener('click', () => {
            showToast('SOAR Playbook: Attacker IP blacklisted across Cloud WAF & Firewalls.', 'danger');
            closeModal(elements.detailModal);
        });

        elements.soarIsolateBtn.addEventListener('click', () => {
            showToast('SOAR Playbook: Compromised Docker Container network isolated.');
            closeModal(elements.detailModal);
        });

        if (elements.soarDownloadBtn) {
            elements.soarDownloadBtn.addEventListener('click', downloadPcapTelemetry);
        }

        elements.exportReportBtn.addEventListener('click', exportReportFile);

        elements.triggerScanBtn.addEventListener('click', () => {
            showToast('Autonomous AI SOAR Playbook Audit initialized across all telemetry streams.');
        });
    }

    function startLiveSimulatedFeed() {
        const threatTypes = [
            { vector: 'Deception Trap: Honey-GraphQL Exploit', severity: 'high', target: '/honey-graphql', vectorType: 'Deception Trapped' },
            { vector: 'Leaked GCP Service Account Key', severity: 'critical', target: 'gcp:iam:service-account', vectorType: 'IAM Leaks' },
            { vector: 'Kubernetes Pod Escalate Command', severity: 'critical', target: 'k8s://cluster-core/exec', vectorType: 'SQLi' },
            { vector: 'Deception Trap: Honey-S3 Access', severity: 'medium', target: 's3://honey-secrets-bucket', vectorType: 'Deception Trapped' }
        ];

        const locations = ['Zurich, Switzerland (CH)', 'Tokyo, Japan (JP)', 'Singapore (SG)', 'São Paulo, Brazil (BR)'];

        setInterval(() => {
            if (!state.user) return;

            const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
            const randomLoc = locations[Math.floor(Math.random() * locations.length)];
            const randomIP = `${Math.floor(Math.random()*200)+10}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
            const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

            const newLog = {
                id: `evt-${Math.floor(Math.random()*9000)+1000}`,
                timestamp: now,
                severity: randomThreat.severity,
                vector: randomThreat.vector,
                sourceIP: randomIP,
                location: randomLoc,
                target: randomThreat.target,
                action: 'AUTONOMOUSLY MITIGATED',
                mitre: 'T1078 - Valid Credentials Misuse',
                payload: `AEGISX REALTIME INTERCEPT:\nTarget: ${randomThreat.target}\nSource: ${randomIP} (${randomLoc})\nAction: SOAR Playbook Auto-Revoked & Quarantined.`
            };

            state.logs.unshift(newLog);
            if (state.logs.length > 25) state.logs.pop();
            renderHistoryTable();

            const newPoint = Math.floor(Math.random() * 80) + 360;
            state.timelineData.push(newPoint);
            if (state.timelineData.length > 12) state.timelineData.shift();

            if (state.vectorCounts[randomThreat.vectorType] !== undefined) {
                state.vectorCounts[randomThreat.vectorType] += 1;
            }

            const kpiBlocked = document.getElementById('kpiBlocked');
            if (kpiBlocked) {
                const currentVal = parseInt(kpiBlocked.textContent.replace(',', '')) || 3942;
                kpiBlocked.textContent = (currentVal + 1).toLocaleString();
            }

            renderCharts();
        }, 8000);
    }

    window.addEventListener('resize', renderCharts);

    initTheme();
    initPasswordMeter();
    initUserSession();
    renderHistoryTable();
    initTableFilters();
    renderCharts();
    initButtons();
    startLiveSimulatedFeed();
});
