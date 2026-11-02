/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FlagshipProject } from '../types';

export const FLAGSHIP_PROJECTS: FlagshipProject[] = [
  // ==========================================
  // PHASE 01 — OPERATOR FOUNDATIONS
  // ==========================================
  {
    id: 'P01',
    number: '01',
    title: 'Personal Cyber Range',
    phaseId: 1,
    phaseName: 'Phase 01 — Operator Foundations',
    category: 'Shared Offensive Foundations',
    repoSuggestion: 'operator-lab',
    purpose: 'A reproducible, isolated environment for networking, operating systems, scripting, and security experiments.',
    specializationLinks: 'Offensive Security; shared foundation for AI Security and Cloud Security.',
    dependencies: [],
    dependents: ['P02', 'P04'],
    coreSubProjects: [
      { id: 'P01-01', title: 'Network Infrastructure Lab', isOptional: false, tags: ['NETWORK_SECURITY'] },
      { id: 'P01-02', title: 'Linux Operating System Lab', isOptional: false, tags: ['LINUX'] },
      { id: 'P01-03', title: 'Windows Operating System Lab', isOptional: false, tags: ['WINDOWS'] },
      { id: 'P01-04', title: 'Network Traffic Analysis Lab', isOptional: false, tags: ['NETWORK_SECURITY'] },
      { id: 'P01-05', title: 'Programming & Automation Toolkit', isOptional: false, tags: ['AUTOMATION'] },
      { id: 'P01-06', title: 'Virtualization & Container Lab', isOptional: false, tags: ['CLOUD_SECURITY'] },
      { id: 'P01-07', title: 'Git & Lab Documentation System', isOptional: false, tags: ['REPORTING'] },
    ],
    optionalSubProjects: [
      { id: 'P01-O01', title: 'Firewall & Network Segmentation Lab', isOptional: true, tags: ['OPTIONAL', 'NETWORK_SECURITY'] },
      { id: 'P01-O02', title: 'Wireless Security Lab', isOptional: true, tags: ['OPTIONAL', 'NETWORK_SECURITY'] },
      { id: 'P01-O03', title: 'IPv6 Security Lab', isOptional: true, tags: ['OPTIONAL', 'NETWORK_SECURITY'] },
    ]
  },
  {
    id: 'P02',
    number: '02',
    title: 'Reconnaissance & Enumeration Workbench',
    phaseId: 1,
    phaseName: 'Phase 01 — Operator Foundations',
    category: 'Offensive Security / Security Automation',
    repoSuggestion: 'scope-recon',
    purpose: 'A scoped reconnaissance and enumeration workbench that turns observations into structured, reproducible asset information.',
    specializationLinks: 'Offensive Security; Cloud Security asset inventory; input to later Red Team engagements.',
    dependencies: ['P01'],
    dependents: ['P03', 'P06'],
    coreSubProjects: [
      { id: 'P02-01', title: 'Scope & Authorization Manager', isOptional: false, tags: ['RECONNAISSANCE'] },
      { id: 'P02-02', title: 'OSINT & Passive Recon Engine', isOptional: false, tags: ['RECONNAISSANCE'] },
      { id: 'P02-03', title: 'DNS & Subdomain Enumeration', isOptional: false, tags: ['RECONNAISSANCE', 'NETWORK_SECURITY'] },
      { id: 'P02-04', title: 'Asset Discovery & Inventory', isOptional: false, tags: ['RECONNAISSANCE'] },
      { id: 'P02-05', title: 'Port & Service Enumeration', isOptional: false, tags: ['RECONNAISSANCE', 'NETWORK_SECURITY'] },
      { id: 'P02-06', title: 'Technology Fingerprinting', isOptional: false, tags: ['RECONNAISSANCE', 'WEB_SECURITY'] },
      { id: 'P02-07', title: 'Network & Attack Surface Mapping', isOptional: false, tags: ['RECONNAISSANCE'] },
      { id: 'P02-08', title: 'Evidence Collection System', isOptional: false, tags: ['REPORTING'] },
      { id: 'P02-09', title: 'JSON / HTML Report Generator', isOptional: false, tags: ['REPORTING', 'AUTOMATION'] },
      { id: 'P02-10', title: 'Scope Enforcement Test Suite', isOptional: false, tags: ['AUTOMATION'] },
    ],
    optionalSubProjects: [
      { id: 'P02-O01', title: 'Threat Intelligence Enrichment', isOptional: true, tags: ['OPTIONAL', 'RECONNAISSANCE'] },
      { id: 'P02-O02', title: 'Continuous Attack Surface Monitoring', isOptional: true, tags: ['OPTIONAL', 'RECONNAISSANCE'] },
      { id: 'P02-O03', title: 'Visual Asset Discovery Dashboard', isOptional: true, tags: ['OPTIONAL', 'RECONNAISSANCE'] },
    ]
  },
  {
    id: 'P03',
    number: '03',
    title: 'Web, API & Mobile Application Security Suite',
    phaseId: 1,
    phaseName: 'Phase 01 — Operator Foundations',
    category: 'Application Security / Freelance Services',
    repoSuggestion: 'application-security-suite',
    purpose: 'A unified application-security portfolio covering Web Applications, APIs, and Android applications, with engineering and client-delivery components.',
    specializationLinks: 'Application Security, Web/API/Mobile Freelancing, and the application layer of AI systems.',
    dependencies: ['P02'],
    dependents: ['P09', 'P12'],
    coreSubProjects: [
      // A. Web Application Security
      { id: 'P03-01', title: 'Authentication & Session Testing', isOptional: false, section: 'A. Web Application Security', tags: ['APPLICATION_SECURITY', 'WEB_SECURITY'] },
      { id: 'P03-02', title: 'Access Control & IDOR Testing', isOptional: false, section: 'A. Web Application Security', tags: ['APPLICATION_SECURITY', 'WEB_SECURITY'] },
      { id: 'P03-03', title: 'Injection & Input Validation Testing', isOptional: false, section: 'A. Web Application Security', tags: ['APPLICATION_SECURITY', 'WEB_SECURITY'] },
      { id: 'P03-04', title: 'Business Logic Security Testing', isOptional: false, section: 'A. Web Application Security', tags: ['APPLICATION_SECURITY', 'WEB_SECURITY'] },
      { id: 'P03-05', title: 'File Handling & SSRF Assessment', isOptional: false, section: 'A. Web Application Security', tags: ['APPLICATION_SECURITY', 'WEB_SECURITY'] },
      { id: 'P03-06', title: 'Source Code Review', isOptional: false, section: 'A. Web Application Security', tags: ['APPLICATION_SECURITY'] },
      // B. API Security
      { id: 'P03-07', title: 'REST API Security Assessment', isOptional: false, section: 'B. API Security', tags: ['APPLICATION_SECURITY', 'API_SECURITY'] },
      { id: 'P03-08', title: 'JWT & OAuth Security', isOptional: false, section: 'B. API Security', tags: ['APPLICATION_SECURITY', 'API_SECURITY', 'IDENTITY_SECURITY'] },
      { id: 'P03-09', title: 'BOLA / BFLA Testing', isOptional: false, section: 'B. API Security', tags: ['APPLICATION_SECURITY', 'API_SECURITY'] },
      { id: 'P03-10', title: 'Rate Limiting & Abuse Testing', isOptional: false, section: 'B. API Security', tags: ['APPLICATION_SECURITY', 'API_SECURITY'] },
      { id: 'P03-11', title: 'GraphQL & WebSocket Security', isOptional: false, section: 'B. API Security', tags: ['APPLICATION_SECURITY', 'API_SECURITY'] },
      // C. Android Application Security
      { id: 'P03-12', title: 'Android APK & Manifest Analysis', isOptional: false, section: 'C. Android Application Security', tags: ['APPLICATION_SECURITY', 'MOBILE_SECURITY'] },
      { id: 'P03-13', title: 'Local Storage & Data Leakage Testing', isOptional: false, section: 'C. Android Application Security', tags: ['APPLICATION_SECURITY', 'MOBILE_SECURITY'] },
      { id: 'P03-14', title: 'Authentication & Session Security', isOptional: false, section: 'C. Android Application Security', tags: ['APPLICATION_SECURITY', 'MOBILE_SECURITY'] },
      { id: 'P03-15', title: 'Network & TLS Testing', isOptional: false, section: 'C. Android Application Security', tags: ['APPLICATION_SECURITY', 'MOBILE_SECURITY'] },
      { id: 'P03-16', title: 'Deep Links, IPC & WebView Security', isOptional: false, section: 'C. Android Application Security', tags: ['APPLICATION_SECURITY', 'MOBILE_SECURITY'] },
      { id: 'P03-17', title: 'Static & Dynamic Analysis', isOptional: false, section: 'C. Android Application Security', tags: ['APPLICATION_SECURITY', 'MOBILE_SECURITY'] },
      // D. Application Security Engineering
      { id: 'P03-18', title: 'Application Threat Modeling', isOptional: false, section: 'D. Application Security Engineering', tags: ['APPLICATION_SECURITY'] },
      { id: 'P03-19', title: 'Secure Code Review Workflow', isOptional: false, section: 'D. Application Security Engineering', tags: ['APPLICATION_SECURITY'] },
      { id: 'P03-20', title: 'SAST / DAST / SCA Integration', isOptional: false, section: 'D. Application Security Engineering', tags: ['APPLICATION_SECURITY', 'AUTOMATION'] },
      { id: 'P03-21', title: 'CI/CD Security Testing', isOptional: false, section: 'D. Application Security Engineering', tags: ['APPLICATION_SECURITY', 'AUTOMATION'] },
      { id: 'P03-22', title: 'Security Regression Test Suite', isOptional: false, section: 'D. Application Security Engineering', tags: ['APPLICATION_SECURITY', 'AUTOMATION'] },
      // E. Client Assessment Package
      { id: 'P03-23', title: 'Scope & Rules of Engagement Templates', isOptional: false, section: 'E. Client Assessment Package', tags: ['FREELANCING', 'REPORTING'] },
      { id: 'P03-24', title: 'Technical Assessment Report Template', isOptional: false, section: 'E. Client Assessment Package', tags: ['FREELANCING', 'REPORTING'] },
      { id: 'P03-25', title: 'Executive Summary Template', isOptional: false, section: 'E. Client Assessment Package', tags: ['FREELANCING', 'REPORTING'] },
      { id: 'P03-26', title: 'Remediation & Retesting Package', isOptional: false, section: 'E. Client Assessment Package', tags: ['FREELANCING', 'REPORTING'] },
      { id: 'P03-27', title: 'Client Handover Package', isOptional: false, section: 'E. Client Assessment Package', tags: ['FREELANCING', 'REPORTING'] },
    ],
    optionalSubProjects: [
      { id: 'P03-O01', title: 'iOS Application Security', isOptional: true, tags: ['OPTIONAL', 'MOBILE_SECURITY'] },
      { id: 'P03-O02', title: 'Advanced Android Instrumentation', isOptional: true, tags: ['OPTIONAL', 'MOBILE_SECURITY'] },
      { id: 'P03-O03', title: 'Advanced API Business Logic Assessment', isOptional: true, tags: ['OPTIONAL', 'API_SECURITY'] },
    ]
  },

  // ==========================================
  // PHASE 02 — ENTERPRISE OFFENSIVE SECURITY
  // ==========================================
  {
    id: 'P04',
    number: '04',
    title: 'Linux & Windows Host Security Assessment Framework',
    phaseId: 2,
    phaseName: 'Phase 02 — Enterprise Offensive Security',
    category: 'Infrastructure Security / Host Assessment',
    repoSuggestion: 'host-assessment-framework',
    purpose: 'Assess operating-system configuration, local security boundaries, privilege exposure, host telemetry, and hardening.',
    specializationLinks: 'Offensive Security, host security assessment, and Detection Engineering.',
    dependencies: ['P01'],
    dependents: ['P05', 'P06'],
    coreSubProjects: [
      // A. Linux Security Assessment
      { id: 'P04-01', title: 'Users, Groups & Permissions Assessment', isOptional: false, section: 'A. Linux Security Assessment', tags: ['LINUX', 'OFFENSIVE_SECURITY'] },
      { id: 'P04-02', title: 'Processes & Services Assessment', isOptional: false, section: 'A. Linux Security Assessment', tags: ['LINUX', 'OFFENSIVE_SECURITY'] },
      { id: 'P04-03', title: 'Sudo, SUID & Capabilities Assessment', isOptional: false, section: 'A. Linux Security Assessment', tags: ['LINUX', 'OFFENSIVE_SECURITY'] },
      { id: 'P04-04', title: 'Linux Privilege Assessment', isOptional: false, section: 'A. Linux Security Assessment', tags: ['LINUX', 'OFFENSIVE_SECURITY'] },
      // B. Windows Security Assessment
      { id: 'P04-05', title: 'Windows Permissions & Access Tokens', isOptional: false, section: 'B. Windows Security Assessment', tags: ['WINDOWS', 'OFFENSIVE_SECURITY'] },
      { id: 'P04-06', title: 'Services, Registry & Scheduled Tasks', isOptional: false, section: 'B. Windows Security Assessment', tags: ['WINDOWS', 'OFFENSIVE_SECURITY'] },
      { id: 'P04-07', title: 'Windows Privilege Assessment', isOptional: false, section: 'B. Windows Security Assessment', tags: ['WINDOWS', 'OFFENSIVE_SECURITY'] },
      { id: 'P04-08', title: 'PowerShell Assessment', isOptional: false, section: 'B. Windows Security Assessment', tags: ['WINDOWS', 'OFFENSIVE_SECURITY'] },
      // C. Enumeration & Evidence Engine
      { id: 'P04-09', title: 'System Information Collector', isOptional: false, section: 'C. Enumeration & Evidence Engine', tags: ['OFFENSIVE_SECURITY', 'AUTOMATION'] },
      { id: 'P04-10', title: 'Credential & Secret Exposure Assessment', isOptional: false, section: 'C. Enumeration & Evidence Engine', tags: ['OFFENSIVE_SECURITY', 'IDENTITY_SECURITY'] },
      { id: 'P04-11', title: 'Process & Service Collection', isOptional: false, section: 'C. Enumeration & Evidence Engine', tags: ['OFFENSIVE_SECURITY'] },
      { id: 'P04-12', title: 'Log & Event Collection', isOptional: false, section: 'C. Enumeration & Evidence Engine', tags: ['DETECTION_ENGINEERING'] },
      // D. Hardening & Validation
      { id: 'P04-13', title: 'Linux Hardening Baseline', isOptional: false, section: 'D. Hardening & Validation', tags: ['LINUX'] },
      { id: 'P04-14', title: 'Windows Hardening Baseline', isOptional: false, section: 'D. Hardening & Validation', tags: ['WINDOWS'] },
      { id: 'P04-15', title: 'Configuration Validation', isOptional: false, section: 'D. Hardening & Validation', tags: ['AUTOMATION'] },
      { id: 'P04-16', title: 'Remediation & Retest', isOptional: false, section: 'D. Hardening & Validation', tags: ['REPORTING'] },
    ],
    optionalSubProjects: [
      { id: 'P04-O01', title: 'Windows Internals & Forensics', isOptional: true, tags: ['OPTIONAL', 'WINDOWS'] },
      { id: 'P04-O02', title: 'Advanced Linux Internals', isOptional: true, tags: ['OPTIONAL', 'LINUX'] },
    ]
  },
  {
    id: 'P05',
    number: '05',
    title: 'Active Directory & Enterprise Identity Security',
    phaseId: 2,
    phaseName: 'Phase 02 — Enterprise Offensive Security',
    category: 'Enterprise Identity / Offensive Security',
    repoSuggestion: 'ad-enterprise-lab',
    purpose: 'A reproducible enterprise identity environment for assessing trust relationships, permissions, authentication, and attack paths.',
    specializationLinks: 'Offensive Security, Enterprise Security, Cloud Identity, and the identity foundations used by AI agents.',
    dependencies: ['P04'],
    dependents: ['P06'],
    coreSubProjects: [
      { id: 'P05-01', title: 'Enterprise Domain Infrastructure', isOptional: false, tags: ['ACTIVE_DIRECTORY'] },
      { id: 'P05-02', title: 'Users, Groups & Organizational Units', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'IDENTITY_SECURITY'] },
      { id: 'P05-03', title: 'DNS, Group Policy & Domain Configuration', isOptional: false, tags: ['ACTIVE_DIRECTORY'] },
      { id: 'P05-04', title: 'Domain & Forest Relationships', isOptional: false, tags: ['ACTIVE_DIRECTORY'] },
      { id: 'P05-05', title: 'Kerberos Authentication Assessment', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'IDENTITY_SECURITY'] },
      { id: 'P05-06', title: 'NTLM Authentication Assessment', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'IDENTITY_SECURITY'] },
      { id: 'P05-07', title: 'LDAP & SPN Analysis', isOptional: false, tags: ['ACTIVE_DIRECTORY'] },
      { id: 'P05-08', title: 'Service Accounts & Delegation Assessment', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'IDENTITY_SECURITY'] },
      { id: 'P05-09', title: 'Active Directory Enumeration', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'RECONNAISSANCE'] },
      { id: 'P05-10', title: 'ACL & Permission Analysis', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'IDENTITY_SECURITY'] },
      { id: 'P05-11', title: 'BloodHound Data & Attack Path Analysis', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'EXPLOITATION_ANALYSIS'] },
      { id: 'P05-12', title: 'Credential Exposure Assessment', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'IDENTITY_SECURITY'] },
      { id: 'P05-13', title: 'Misconfiguration & Privilege Path Assessment', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'EXPLOITATION_ANALYSIS'] },
      { id: 'P05-14', title: 'Identity Hardening & Remediation', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'IDENTITY_SECURITY'] },
      { id: 'P05-15', title: 'Retesting & Identity Security Report', isOptional: false, tags: ['ACTIVE_DIRECTORY', 'REPORTING'] },
    ],
    optionalSubProjects: [
      { id: 'P05-O01', title: 'Active Directory Certificate Services Assessment', isOptional: true, tags: ['OPTIONAL', 'ACTIVE_DIRECTORY'] },
      { id: 'P05-O02', title: 'Entra ID & Hybrid Identity', isOptional: true, tags: ['OPTIONAL', 'IDENTITY_SECURITY', 'CLOUD_SECURITY'] },
      { id: 'P05-O03', title: 'Domain Trust Assessment', isOptional: true, tags: ['OPTIONAL', 'ACTIVE_DIRECTORY'] },
    ]
  },
  {
    id: 'P06',
    number: '06',
    title: 'Full Internal Red Team Engagement',
    phaseId: 2,
    phaseName: 'Phase 02 — Enterprise Offensive Security',
    category: 'Offensive Security / Engagement Operations',
    repoSuggestion: 'red-team-engagement-01',
    purpose: 'Integrate reconnaissance, host assessment, identity assessment, controlled attack-path validation, detection review, and professional reporting in one authorized engagement.',
    specializationLinks: 'Offensive Security; consumes work from Projects 02, 04, and 05; feeds Project 08 and Project 12.',
    dependencies: ['P02', 'P04', 'P05'],
    dependents: ['P08', 'P09', 'P12'],
    coreSubProjects: [
      { id: 'P06-01', title: 'Engagement Planning & Rules of Engagement', isOptional: false, tags: ['OFFENSIVE_SECURITY', 'REPORTING'] },
      { id: 'P06-02', title: 'Internal Reconnaissance', isOptional: false, tags: ['OFFENSIVE_SECURITY', 'RECONNAISSANCE'] },
      { id: 'P06-03', title: 'Internal Attack Surface Mapping', isOptional: false, tags: ['OFFENSIVE_SECURITY', 'RECONNAISSANCE'] },
      { id: 'P06-04', title: 'Initial Access Simulation', isOptional: false, tags: ['OFFENSIVE_SECURITY', 'EXPLOITATION_ANALYSIS'] },
      { id: 'P06-05', title: 'Host & Identity Assessment', isOptional: false, tags: ['OFFENSIVE_SECURITY', 'IDENTITY_SECURITY'] },
      { id: 'P06-06', title: 'Privilege & Credential Path Assessment', isOptional: false, tags: ['OFFENSIVE_SECURITY', 'EXPLOITATION_ANALYSIS'] },
      { id: 'P06-07', title: 'Lateral Movement Simulation', isOptional: false, tags: ['OFFENSIVE_SECURITY', 'EXPLOITATION_ANALYSIS'] },
      { id: 'P06-08', title: 'Controlled Objective Validation', isOptional: false, tags: ['OFFENSIVE_SECURITY'] },
      { id: 'P06-09', title: 'MITRE ATT&CK Mapping', isOptional: false, tags: ['OFFENSIVE_SECURITY', 'REPORTING'] },
      { id: 'P06-10', title: 'Detection & Telemetry Review', isOptional: false, tags: ['DETECTION_ENGINEERING'] },
      { id: 'P06-11', title: 'Evidence Package & Attack Timeline', isOptional: false, tags: ['REPORTING'] },
      { id: 'P06-12', title: 'Technical Report & Executive Summary', isOptional: false, tags: ['REPORTING'] },
      { id: 'P06-13', title: 'Remediation, Retest & Cleanup', isOptional: false, tags: ['REPORTING'] },
      { id: 'P06-14', title: 'Engagement Debrief & Handover', isOptional: false, tags: ['REPORTING'] },
    ],
    optionalSubProjects: [
      { id: 'P06-O01', title: 'Multi-Domain Enterprise Campaign', isOptional: true, tags: ['OPTIONAL', 'ACTIVE_DIRECTORY'] },
      { id: 'P06-O02', title: 'Hybrid Identity Engagement', isOptional: true, tags: ['OPTIONAL', 'CLOUD_SECURITY'] },
      { id: 'P06-O03', title: 'Advanced Adversary Infrastructure Lab', isOptional: true, tags: ['OPTIONAL', 'OFFENSIVE_SECURITY'] },
    ]
  },

  // ==========================================
  // PHASE 03 — CLOUD SECURITY & SECURITY OPERATIONS
  // ==========================================
  {
    id: 'P07',
    number: '07',
    title: 'Cloud Security Assessment & Hardening Platform',
    phaseId: 3,
    phaseName: 'Phase 03 — Cloud Security & Security Operations',
    category: 'Cloud Security',
    primaryCloud: 'AWS',
    repoSuggestion: 'cloud-security-platform',
    purpose: 'Assess and harden cloud identity, network boundaries, data stores, workloads, containers, and monitoring.',
    specializationLinks: 'Cloud Security; cloud environment for AI applications and agents; Project 12 integration.',
    dependencies: [],
    dependents: ['P08', 'P12'],
    coreSubProjects: [
      { id: 'P07-01', title: 'Cloud Architecture & Asset Inventory', isOptional: false, tags: ['CLOUD_SECURITY'] },
      { id: 'P07-02', title: 'AWS Environment Architecture', isOptional: false, tags: ['CLOUD_SECURITY'] },
      { id: 'P07-03', title: 'IAM Users, Roles & Policies Assessment', isOptional: false, tags: ['CLOUD_SECURITY', 'IDENTITY_SECURITY'] },
      { id: 'P07-04', title: 'Least Privilege & Identity Attack Paths', isOptional: false, tags: ['CLOUD_SECURITY', 'IDENTITY_SECURITY'] },
      { id: 'P07-05', title: 'VPC & Subnet Security', isOptional: false, tags: ['CLOUD_SECURITY', 'NETWORK_SECURITY'] },
      { id: 'P07-06', title: 'Security Groups, Routing & Segmentation', isOptional: false, tags: ['CLOUD_SECURITY', 'NETWORK_SECURITY'] },
      { id: 'P07-07', title: 'S3 & Storage Permissions Assessment', isOptional: false, tags: ['CLOUD_SECURITY'] },
      { id: 'P07-08', title: 'Secrets & Sensitive Data Protection', isOptional: false, tags: ['CLOUD_SECURITY'] },
      { id: 'P07-09', title: 'Docker & Container Security', isOptional: false, tags: ['CLOUD_SECURITY'] },
      { id: 'P07-10', title: 'Kubernetes Security Fundamentals', isOptional: false, tags: ['CLOUD_SECURITY'] },
      { id: 'P07-11', title: 'CloudTrail, Logging & Monitoring', isOptional: false, tags: ['CLOUD_SECURITY', 'DETECTION_ENGINEERING'] },
      { id: 'P07-12', title: 'Cloud Incident Readiness', isOptional: false, tags: ['CLOUD_SECURITY'] },
      { id: 'P07-13', title: 'Infrastructure as Code Security', isOptional: false, tags: ['CLOUD_SECURITY', 'AUTOMATION'] },
      { id: 'P07-14', title: 'Policy as Code & Configuration Validation', isOptional: false, tags: ['CLOUD_SECURITY', 'AUTOMATION'] },
      { id: 'P07-15', title: 'Cloud Hardening, Remediation & Retesting', isOptional: false, tags: ['CLOUD_SECURITY', 'REPORTING'] },
    ],
    optionalSubProjects: [
      { id: 'P07-O01', title: 'Azure Security Assessment', isOptional: true, tags: ['OPTIONAL', 'CLOUD_SECURITY'] },
      { id: 'P07-O02', title: 'Advanced Kubernetes Security', isOptional: true, tags: ['OPTIONAL', 'CLOUD_SECURITY'] },
      { id: 'P07-O03', title: 'Serverless Security', isOptional: true, tags: ['OPTIONAL', 'CLOUD_SECURITY'] },
      { id: 'P07-O04', title: 'Multi-Cloud Security', isOptional: true, tags: ['OPTIONAL', 'CLOUD_SECURITY'] },
    ]
  },
  {
    id: 'P08',
    number: '08',
    title: 'Detection Engineering & Purple Team Validation',
    phaseId: 3,
    phaseName: 'Phase 03 — Cloud Security & Security Operations',
    category: 'Detection Engineering / Defensive Validation',
    repoSuggestion: 'purple-team-validation-platform',
    purpose: 'Validate what security controls observe, detect, and miss during controlled security testing.',
    specializationLinks: 'Offensive Security, Security Operations, Cloud Security, and AI security monitoring.',
    dependencies: ['P06', 'P07'],
    dependents: ['P09', 'P12'],
    coreSubProjects: [
      { id: 'P08-01', title: 'Telemetry Collection Architecture', isOptional: false, tags: ['DETECTION_ENGINEERING'] },
      { id: 'P08-02', title: 'Windows Event Logs & Sysmon', isOptional: false, tags: ['DETECTION_ENGINEERING', 'WINDOWS'] },
      { id: 'P08-03', title: 'Linux Audit & System Logs', isOptional: false, tags: ['DETECTION_ENGINEERING', 'LINUX'] },
      { id: 'P08-04', title: 'Cloud Telemetry Integration', isOptional: false, tags: ['DETECTION_ENGINEERING', 'CLOUD_SECURITY'] },
      { id: 'P08-05', title: 'MITRE ATT&CK Mapping', isOptional: false, tags: ['DETECTION_ENGINEERING', 'PURPLE_TEAM'] },
      { id: 'P08-06', title: 'Atomic Test Library', isOptional: false, tags: ['PURPLE_TEAM', 'AUTOMATION'] },
      { id: 'P08-07', title: 'Controlled Adversary Emulation Scenarios', isOptional: false, tags: ['PURPLE_TEAM', 'OFFENSIVE_SECURITY'] },
      { id: 'P08-08', title: 'Detection Use Cases', isOptional: false, tags: ['DETECTION_ENGINEERING'] },
      { id: 'P08-09', title: 'Sigma Rule Development', isOptional: false, tags: ['DETECTION_ENGINEERING'] },
      { id: 'P08-10', title: 'Alert Logic & Validation', isOptional: false, tags: ['DETECTION_ENGINEERING'] },
      { id: 'P08-11', title: 'False Positive / False Negative Analysis', isOptional: false, tags: ['DETECTION_ENGINEERING'] },
      { id: 'P08-12', title: 'Incident Investigation Simulation', isOptional: false, tags: ['DETECTION_ENGINEERING'] },
      { id: 'P08-13', title: 'Response Playbooks', isOptional: false, tags: ['DETECTION_ENGINEERING'] },
      { id: 'P08-14', title: 'Detection Coverage Matrix', isOptional: false, tags: ['PURPLE_TEAM', 'REPORTING'] },
      { id: 'P08-15', title: 'Detection Regression & Purple Team Report', isOptional: false, tags: ['PURPLE_TEAM', 'REPORTING'] },
    ],
    optionalSubProjects: [
      { id: 'P08-O01', title: 'SIEM Integration', isOptional: true, tags: ['OPTIONAL', 'DETECTION_ENGINEERING'] },
      { id: 'P08-O02', title: 'Threat Hunting', isOptional: true, tags: ['OPTIONAL', 'DETECTION_ENGINEERING'] },
      { id: 'P08-O03', title: 'Advanced Endpoint Forensics', isOptional: true, tags: ['OPTIONAL', 'DETECTION_ENGINEERING'] },
    ]
  },
  {
    id: 'P09',
    number: '09',
    title: 'Open Pentest Knowledge Engine',
    phaseId: 3,
    phaseName: 'Phase 03 — Cloud Security & Security Operations',
    category: 'AI Engineering Foundation / Security Knowledge Product',
    repoSuggestion: 'pentest-knowledge-engine',
    purpose: 'Build an openly documented, traceable, searchable security knowledge system that can later support RAG and controlled agents.',
    specializationLinks: 'AI Security Engineering foundation; receives knowledge from Projects 02, 03, 04, 05, 06, and 08; feeds Projects 10 and 11.',
    dependencies: ['P03', 'P06', 'P08'],
    dependents: ['P10', 'P11'],
    coreSubProjects: [
      { id: 'P09-01', title: 'Source Collection & Registry', isOptional: false, tags: ['RAG_SECURITY', 'REPORTING'] },
      { id: 'P09-02', title: 'Official Documentation & Standards Corpus', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-03', title: 'Research Papers & Vulnerability Advisories Corpus', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-04', title: 'Personal Lab Notes & Writeups Corpus', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-05', title: 'License & Provenance Registry', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-06', title: 'Document Ingestion Pipeline', isOptional: false, tags: ['RAG_SECURITY', 'AUTOMATION'] },
      { id: 'P09-07', title: 'Normalization & Deduplication Pipeline', isOptional: false, tags: ['RAG_SECURITY', 'AUTOMATION'] },
      { id: 'P09-08', title: 'Security Knowledge Taxonomy', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-09', title: 'Metadata Extraction & Classification', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-10', title: 'Chunking & Embeddings', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-11', title: 'Vector Search & Retrieval', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-12', title: 'RAG Retrieval & Source Citations', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-13', title: 'Retrieval Evaluation Dataset', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-14', title: 'Answer Grounding & Attribution Tests', isOptional: false, tags: ['RAG_SECURITY'] },
      { id: 'P09-15', title: 'Search Interface & Knowledge API', isOptional: false, tags: ['RAG_SECURITY', 'API_SECURITY'] },
    ],
    optionalSubProjects: [
      { id: 'P09-O01', title: 'Fine-Tuning / LoRA Experiments', isOptional: true, tags: ['OPTIONAL', 'AI_SECURITY_ENGINEERING'] },
      { id: 'P09-O02', title: 'Security Finding Classification Model', isOptional: true, tags: ['OPTIONAL', 'AI_SECURITY_ENGINEERING'] },
      { id: 'P09-O03', title: 'Knowledge Contribution Portal', isOptional: true, tags: ['OPTIONAL', 'WEB_SECURITY'] },
    ]
  },

  // ==========================================
  // PHASE 04 — AI SECURITY ENGINEERING
  // ==========================================
  {
    id: 'P10',
    number: '10',
    title: 'LLM Application Red Teaming & Evaluation Platform',
    phaseId: 4,
    phaseName: 'Phase 04 — AI Security Engineering',
    category: 'AI Security Engineering / LLM Red Teaming',
    repoSuggestion: 'llm-red-team-platform',
    purpose: 'Build and assess an LLM-powered application using repeatable security tests, evidence, evaluation, and remediation.',
    specializationLinks: 'AI Security Engineering; builds on Project 09; feeds Project 11 and Project 12.',
    dependencies: ['P09'],
    dependents: ['P11'],
    coreSubProjects: [
      { id: 'P10-01', title: 'LLM Application Environment', isOptional: false, tags: ['AI_SECURITY_ENGINEERING', 'LLM_SECURITY'] },
      { id: 'P10-02', title: 'Model Endpoint & Backend API Integration', isOptional: false, tags: ['LLM_SECURITY', 'API_SECURITY'] },
      { id: 'P10-03', title: 'Session & Context Management', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-04', title: 'Synthetic Data & Logging Environment', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-05', title: 'AI System Threat Model', isOptional: false, tags: ['AI_SECURITY_ENGINEERING', 'LLM_SECURITY'] },
      { id: 'P10-06', title: 'Data Flow & Trust Boundary Map', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-07', title: 'Direct Prompt Injection Testing', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-08', title: 'Indirect Prompt Injection Testing', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-09', title: 'Jailbreak Robustness Evaluation', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-10', title: 'Sensitive Data Disclosure Testing', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-11', title: 'System Prompt & Configuration Exposure Testing', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-12', title: 'Unsafe Output Handling Assessment', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-13', title: 'Cross-Session Isolation Testing', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-14', title: 'Model & API Abuse Assessment', isOptional: false, tags: ['LLM_SECURITY'] },
      { id: 'P10-15', title: 'Automated Evaluation Harness', isOptional: false, tags: ['LLM_SECURITY', 'AUTOMATION'] },
      { id: 'P10-16', title: 'Scoring & Human Review Workflow', isOptional: false, tags: ['LLM_SECURITY', 'REPORTING'] },
      { id: 'P10-17', title: 'Evidence Capture & Regression Testing', isOptional: false, tags: ['LLM_SECURITY', 'REPORTING'] },
      { id: 'P10-18', title: 'AI Defense, Remediation & Retesting', isOptional: false, tags: ['LLM_SECURITY', 'REPORTING'] },
    ],
    optionalSubProjects: [
      { id: 'P10-O01', title: 'Multimodal AI Security Testing', isOptional: true, tags: ['OPTIONAL', 'LLM_SECURITY'] },
      { id: 'P10-O02', title: 'Model Privacy Assessment', isOptional: true, tags: ['OPTIONAL', 'LLM_SECURITY'] },
      { id: 'P10-O03', title: 'Adversarial Machine Learning Experiments', isOptional: true, tags: ['OPTIONAL', 'AI_SECURITY_ENGINEERING'] },
    ]
  },
  {
    id: 'P11',
    number: '11',
    title: 'RAG, AI Agents & MCP Security',
    phaseId: 4,
    phaseName: 'Phase 04 — AI Security Engineering',
    category: 'AI Security Engineering / Agent Security',
    repoSuggestion: 'controlled-agent-security-platform',
    purpose: 'Assess and engineer the security of retrieval systems, agents, tools, permissions, and controlled execution.',
    specializationLinks: 'AI Security Engineering; consumes Project 09 knowledge and Project 10 evaluation methods; feeds Project 12.',
    dependencies: ['P09', 'P10'],
    dependents: ['P12'],
    coreSubProjects: [
      // A. RAG Security Assessment
      { id: 'P11-01', title: 'Document Ingestion Security', isOptional: false, section: 'A. RAG Security Assessment', tags: ['RAG_SECURITY'] },
      { id: 'P11-02', title: 'Chunking & Embedding Integrity', isOptional: false, section: 'A. RAG Security Assessment', tags: ['RAG_SECURITY'] },
      { id: 'P11-03', title: 'Retrieval Access Control', isOptional: false, section: 'A. RAG Security Assessment', tags: ['RAG_SECURITY', 'IDENTITY_SECURITY'] },
      { id: 'P11-04', title: 'Tenant Isolation', isOptional: false, section: 'A. RAG Security Assessment', tags: ['RAG_SECURITY'] },
      { id: 'P11-05', title: 'Indirect Prompt Injection Through Documents', isOptional: false, section: 'A. RAG Security Assessment', tags: ['RAG_SECURITY', 'LLM_SECURITY'] },
      { id: 'P11-06', title: 'Knowledge Base Poisoning Assessment', isOptional: false, section: 'A. RAG Security Assessment', tags: ['RAG_SECURITY'] },
      { id: 'P11-07', title: 'Source Attribution & Retrieval Regression', isOptional: false, section: 'A. RAG Security Assessment', tags: ['RAG_SECURITY'] },
      // B. AI Agent Architecture
      { id: 'P11-08', title: 'Mission Planner', isOptional: false, section: 'B. AI Agent Architecture', tags: ['AGENT_SECURITY'] },
      { id: 'P11-09', title: 'Knowledge Agent', isOptional: false, section: 'B. AI Agent Architecture', tags: ['AGENT_SECURITY'] },
      { id: 'P11-10', title: 'Analysis Agent', isOptional: false, section: 'B. AI Agent Architecture', tags: ['AGENT_SECURITY'] },
      { id: 'P11-11', title: 'Validation Agent', isOptional: false, section: 'B. AI Agent Architecture', tags: ['AGENT_SECURITY'] },
      { id: 'P11-12', title: 'Evidence Agent', isOptional: false, section: 'B. AI Agent Architecture', tags: ['AGENT_SECURITY'] },
      { id: 'P11-13', title: 'Report Agent', isOptional: false, section: 'B. AI Agent Architecture', tags: ['AGENT_SECURITY'] },
      { id: 'P11-14', title: 'Agent Orchestrator', isOptional: false, section: 'B. AI Agent Architecture', tags: ['AGENT_SECURITY'] },
      // C. Tool & MCP Security
      { id: 'P11-15', title: 'Tool Registry', isOptional: false, section: 'C. Tool & MCP Security', tags: ['MCP_SECURITY'] },
      { id: 'P11-16', title: 'MCP Server & Client Security', isOptional: false, section: 'C. Tool & MCP Security', tags: ['MCP_SECURITY'] },
      { id: 'P11-17', title: 'Tool Input Validation', isOptional: false, section: 'C. Tool & MCP Security', tags: ['MCP_SECURITY'] },
      { id: 'P11-18', title: 'Tool Permission Boundaries', isOptional: false, section: 'C. Tool & MCP Security', tags: ['MCP_SECURITY'] },
      // D. Agent Authorization & Isolation
      { id: 'P11-19', title: 'Scope & Policy Guard', isOptional: false, section: 'D. Agent Authorization & Isolation', tags: ['AGENT_SECURITY'] },
      { id: 'P11-20', title: 'Sandboxed Execution', isOptional: false, section: 'D. Agent Authorization & Isolation', tags: ['AGENT_SECURITY'] },
      { id: 'P11-21', title: 'Human Approval Workflow', isOptional: false, section: 'D. Agent Authorization & Isolation', tags: ['AGENT_SECURITY'] },
      { id: 'P11-22', title: 'Identity & Secret Isolation', isOptional: false, section: 'D. Agent Authorization & Isolation', tags: ['AGENT_SECURITY', 'IDENTITY_SECURITY'] },
      { id: 'P11-23', title: 'Network Egress Controls', isOptional: false, section: 'D. Agent Authorization & Isolation', tags: ['AGENT_SECURITY', 'NETWORK_SECURITY'] },
      // E. Agent Security Evaluation
      { id: 'P11-24', title: 'Agent Prompt Injection Tests', isOptional: false, section: 'E. Agent Security Evaluation', tags: ['AGENT_SECURITY', 'LLM_SECURITY'] },
      { id: 'P11-25', title: 'Unauthorized Tool Use Tests', isOptional: false, section: 'E. Agent Security Evaluation', tags: ['AGENT_SECURITY', 'MCP_SECURITY'] },
      { id: 'P11-26', title: 'Audit Trail & Action Traceability', isOptional: false, section: 'E. Agent Security Evaluation', tags: ['AGENT_SECURITY', 'REPORTING'] },
      { id: 'P11-27', title: 'Agent Security Regression Tests', isOptional: false, section: 'E. Agent Security Evaluation', tags: ['AGENT_SECURITY', 'AUTOMATION'] },
    ],
    optionalSubProjects: [
      { id: 'P11-O01', title: 'AI Browser Agent Security', isOptional: true, tags: ['OPTIONAL', 'AGENT_SECURITY'] },
      { id: 'P11-O02', title: 'AI Coding Agent Security', isOptional: true, tags: ['OPTIONAL', 'AGENT_SECURITY'] },
      { id: 'P11-O03', title: 'Multi-Agent Collaboration Security', isOptional: true, tags: ['OPTIONAL', 'AGENT_SECURITY'] },
    ]
  },
  {
    id: 'P12',
    number: '12',
    title: 'Integrated Enterprise & AI Red Team Capstone',
    phaseId: 4,
    phaseName: 'Phase 04 — AI Security Engineering',
    category: 'Integrated Security Engagement / Final Portfolio',
    repoSuggestion: 'integrated-red-team-capstone',
    purpose: 'Demonstrate an end-to-end, evidence-based traditional enterprise security engagement and an AI security engagement, with engineering validation and professional release artifacts.',
    specializationLinks: 'All three specializations; integrates Application Security and the enterprise and AI projects.',
    dependencies: ['P03', 'P06', 'P07', 'P08', 'P11'],
    dependents: [],
    coreSubProjects: [
      // A. Traditional Enterprise Engagement
      { id: 'P12-01', title: 'Network & Infrastructure Assessment', isOptional: false, section: 'A. Traditional Enterprise Engagement', tags: ['OFFENSIVE_SECURITY', 'NETWORK_SECURITY'] },
      { id: 'P12-02', title: 'Web / API / Android Assessment', isOptional: false, section: 'A. Traditional Enterprise Engagement', tags: ['APPLICATION_SECURITY'] },
      { id: 'P12-03', title: 'Linux & Windows Host Assessment', isOptional: false, section: 'A. Traditional Enterprise Engagement', tags: ['LINUX', 'WINDOWS'] },
      { id: 'P12-04', title: 'Active Directory Assessment', isOptional: false, section: 'A. Traditional Enterprise Engagement', tags: ['ACTIVE_DIRECTORY'] },
      { id: 'P12-05', title: 'Cloud Environment Assessment', isOptional: false, section: 'A. Traditional Enterprise Engagement', tags: ['CLOUD_SECURITY'] },
      { id: 'P12-06', title: 'Detection & Purple Team Validation', isOptional: false, section: 'A. Traditional Enterprise Engagement', tags: ['PURPLE_TEAM', 'DETECTION_ENGINEERING'] },
      // B. AI Red Team Engagement
      { id: 'P12-07', title: 'LLM Application Assessment', isOptional: false, section: 'B. AI Red Team Engagement', tags: ['LLM_SECURITY'] },
      { id: 'P12-08', title: 'RAG Knowledge Engine Assessment', isOptional: false, section: 'B. AI Red Team Engagement', tags: ['RAG_SECURITY'] },
      { id: 'P12-09', title: 'AI Agent Assessment', isOptional: false, section: 'B. AI Red Team Engagement', tags: ['AGENT_SECURITY'] },
      { id: 'P12-10', title: 'MCP & Tool Security Assessment', isOptional: false, section: 'B. AI Red Team Engagement', tags: ['MCP_SECURITY'] },
      { id: 'P12-11', title: 'AI Evaluation & Regression Assessment', isOptional: false, section: 'B. AI Red Team Engagement', tags: ['AI_SECURITY_ENGINEERING'] },
      // C. Security Engineering Validation
      { id: 'P12-12', title: 'Integrated Threat Model', isOptional: false, section: 'C. Security Engineering Validation', tags: ['OFFENSIVE_SECURITY', 'REPORTING'] },
      { id: 'P12-13', title: 'Scope & Policy Enforcement Validation', isOptional: false, section: 'C. Security Engineering Validation', tags: ['OFFENSIVE_SECURITY'] },
      { id: 'P12-14', title: 'Evidence Quality & Technical QA', isOptional: false, section: 'C. Security Engineering Validation', tags: ['REPORTING'] },
      { id: 'P12-15', title: 'Remediation & Retesting', isOptional: false, section: 'C. Security Engineering Validation', tags: ['REPORTING'] },
      { id: 'P12-16', title: 'Technical & Executive Reporting', isOptional: false, section: 'C. Security Engineering Validation', tags: ['REPORTING'] },
      // D. Final Portfolio & Product Release
      { id: 'P12-17', title: 'Pentest Knowledge Engine v1 Release', isOptional: false, section: 'D. Final Portfolio & Product Release', tags: ['REPORTING'] },
      { id: 'P12-18', title: 'Controlled Red Team Agent System v1 Release', isOptional: false, section: 'D. Final Portfolio & Product Release', tags: ['REPORTING', 'AGENT_SECURITY'] },
      { id: 'P12-19', title: 'Enterprise Engagement Case Study', isOptional: false, section: 'D. Final Portfolio & Product Release', tags: ['REPORTING', 'FREELANCING'] },
      { id: 'P12-20', title: 'AI Red Team Case Study', isOptional: false, section: 'D. Final Portfolio & Product Release', tags: ['REPORTING'] },
      { id: 'P12-21', title: 'GitHub Releases & Portfolio Publication', isOptional: false, section: 'D. Final Portfolio & Product Release', tags: ['REPORTING'] },
    ],
    optionalSubProjects: [
      { id: 'P12-O01', title: 'Independent External Lab Assessment', isOptional: true, tags: ['OPTIONAL', 'OFFENSIVE_SECURITY'] },
      { id: 'P12-O02', title: 'Open-Source Security Contribution', isOptional: true, tags: ['OPTIONAL', 'AUTOMATION'] },
      { id: 'P12-O03', title: 'Authorized Freelance Engagement', isOptional: true, tags: ['OPTIONAL', 'FREELANCING'] },
      { id: 'P12-O04', title: 'Research Publication', isOptional: true, tags: ['OPTIONAL', 'REPORTING'] },
    ]
  }
];

export const TOTAL_CORE_SUBPROJECTS = FLAGSHIP_PROJECTS.reduce(
  (acc, p) => acc + p.coreSubProjects.length,
  0
);

export const PHASES = [
  { id: 1, name: 'Phase 01 — Operator Foundations', projects: ['P01', 'P02', 'P03'], color: 'border-blue-500/30' },
  { id: 2, name: 'Phase 02 — Enterprise Offensive Security', projects: ['P04', 'P05', 'P06'], color: 'border-indigo-500/30' },
  { id: 3, name: 'Phase 03 — Cloud Security & Security Operations', projects: ['P07', 'P08', 'P09'], color: 'border-sky-500/30' },
  { id: 4, name: 'Phase 04 — AI Security Engineering', projects: ['P10', 'P11', 'P12'], color: 'border-violet-500/30' },
];

export const EMPTY_NOTE_CALLOUT = "Your roadmap is ready. Open a project to record your first activity. Your changes are saved in this browser. Export a JSON backup regularly to protect your notes or move them to another device.";
