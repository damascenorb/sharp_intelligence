import React, { useState, useRef, useMemo } from 'react';
import {
  Users, Building2, Plus, CheckCircle2, Clock,
  Calendar, Phone, Mail, Edit3, Save, Trash2, Search, Filter,
  Sparkles, FileText, Check, ShieldCheck, AlertTriangle, Target,
  TrendingUp, Layers, ExternalLink, Archive, AlertCircle, RefreshCw,
  Upload, Image as ImageIcon, DollarSign, Briefcase, Eye, ChevronRight,
  X, CheckSquare, MessageSquare, Tag, MapPin, Hash, ArrowUpRight,
  Percent, ArrowDownRight, Info, ListChecks, HelpCircle, Package
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Account, Contact, Project, SolutionId, ProjectActiveProduct } from '../../types';
import { generateDefaultSubProducts, getProductColorTheme } from '../../utils/productUtils';
import { SHARP_SOLUTIONS } from '../../data/mockData';
import {
  SHARP_OFFICIAL_PACKAGES,
  calculatePreStipulatedValues,
  formatBRL,
  getDefaultPackageForSolution,
  getPackagesForSolution,
  ServicePackagePricing
} from '../../data/sharpPricingData';
import { isClientMatch, normalizeClientKey } from '../../utils/clientMatching';

export const AccountsAndRelationships: React.FC = () => {
  const {
    currentUser,
    projects,
    accounts,
    contacts,
    createAccount,
    updateAccount,
    archiveAccount,
    deleteAccountPermanently,
    deleteClientPermanently,
    archiveClientCascade,
    restoreClientCascade,
    createContact,
    updateContact,
    addProject,
    updateProject,
    syncAllRegisteredClientsToProjects,
    officialPackages,
    setActiveNavTab
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Confirmation Modal for Client Actions (Archive / Restore / Delete)
  const [clientActionModal, setClientActionModal] = useState<{
    isOpen: boolean;
    type: 'archive' | 'restore' | 'delete';
    clientName: string;
    accountId?: string;
  } | null>(null);

  // Pop-up Modal for Client Menu & Details
  const [selectedClientForModal, setSelectedClientForModal] = useState<{
    account: Account;
    project?: Project;
    contact?: Contact;
  } | null>(null);
  
  const [activePopupTab, setActivePopupTab] = useState<'cadastro' | 'produtos' | 'financeiro' | 'logo' | 'observacoes'>('cadastro');
  const [isEditingInModal, setIsEditingInModal] = useState(false);

  // Overrides per package and Product Details Pop-up Modal State
  const [editPackagePriceOverrides, setEditPackagePriceOverrides] = useState<Record<string, { customPrice: number; reason?: string }>>({});
  const [selectedPackageForDetailModal, setSelectedPackageForDetailModal] = useState<ServicePackagePricing | null>(null);
  const [detailModalCustomPrice, setDetailModalCustomPrice] = useState<string>('');
  const [detailModalReason, setDetailModalReason] = useState<string>('');

  // New Client Modal State
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newClientFileInputRef = useRef<HTMLInputElement>(null);

  // Form State: Edit Existing Client inside Pop-up Modal
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editLegalName, setEditLegalName] = useState('');
  const [editSegment, setEditSegment] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editContactName, setEditContactName] = useState('');
  const [editCnpj, setEditCnpj] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editContractValue, setEditContractValue] = useState('');
  const [editMonthlyFee, setEditMonthlyFee] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'archived'>('active');
  const [editSelectedSolutions, setEditSelectedSolutions] = useState<SolutionId[]>(['sharp_brand', 'sharp_presence']);
  const [editContractedPackages, setEditContractedPackages] = useState<string[]>(['brand_strategy', 'presence_strategic']);

  // Form State: New Client
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newLegalName, setNewLegalName] = useState('');
  const [newSegment, setNewSegment] = useState('Serviços & Negócios');
  const [newCompanyPhone, setNewCompanyPhone] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newCnpj, setNewCnpj] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newContractValue, setNewContractValue] = useState('2990');
  const [newMonthlyFee, setNewMonthlyFee] = useState('1790');
  const [newNotes, setNewNotes] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [newSolutions, setNewSolutions] = useState<SolutionId[]>(['sharp_brand', 'sharp_presence']);
  const [newContractedPackages, setNewContractedPackages] = useState<string[]>(['brand_strategy', 'presence_strategic']);

  // Dynamic calculation of official pre-stipulated values from attachments
  const editPreStipulated = useMemo(() => {
    return calculatePreStipulatedValues(editSelectedSolutions, editContractedPackages, officialPackages);
  }, [editSelectedSolutions, editContractedPackages, officialPackages]);

  const newPreStipulated = useMemo(() => {
    return calculatePreStipulatedValues(newSolutions, newContractedPackages, officialPackages);
  }, [newSolutions, newContractedPackages, officialPackages]);

  const applyEditPreStipulatedValues = () => {
    setEditContractValue(String(editPreStipulated.suggestedOneTimeContractValue || 0));
    setEditMonthlyFee(String(editPreStipulated.suggestedMonthlyFee || 0));
  };

  const applyNewPreStipulatedValues = () => {
    setNewContractValue(String(newPreStipulated.suggestedOneTimeContractValue || 0));
    setNewMonthlyFee(String(newPreStipulated.suggestedMonthlyFee || 0));
  };

  // Combined client cards list derived from accounts and synchronized with projects
  const clientCards = useMemo(() => {
    // Collect all accounts
    const map = new Map<string, { account: Account; project?: Project; contact?: Contact }>();

    accounts.forEach(acc => {
      const contact = contacts.find(c => (c.accountId === acc.id || isClientMatch(c, acc.companyName)) && c.isPrimary) || 
                      contacts.find(c => c.accountId === acc.id || isClientMatch(c, acc.companyName));
      const project = projects.find(p => 
        (p.accountId && p.accountId === acc.id) || 
        isClientMatch(p, acc.companyName)
      );
      const key = normalizeClientKey(acc.companyName);
      map.set(key, { account: acc, project, contact });
    });

    // Also include any project that doesn't have an explicit account yet
    projects.forEach(p => {
      const key = normalizeClientKey(p.companyName);
      if (!map.has(key)) {
        const fakeAcc: Account = {
          id: p.accountId || `acc-${p.id}`,
          companyName: p.companyName,
          segment: p.segment || 'Serviços & Negócios',
          phone: p.clientPhone || '(19) 9 9568-2110',
          cnpj: p.cnpj,
          address: p.address,
          logoUrl: p.logoUrl,
          contractValue: p.contractValue,
          monthlyFee: p.monthlyFee,
          notes: p.notes,
          status: p.archived ? 'archived' : 'active',
          createdAt: p.createdAt,
          updatedAt: p.updatedAt || p.createdAt
        };
        const fakeContact: Contact = {
          id: `cont-${p.id}`,
          accountId: fakeAcc.id,
          name: p.clientName,
          email: p.clientEmail,
          phone: p.clientPhone,
          isPrimary: true,
          status: p.archived ? 'archived' : 'active',
          createdAt: p.createdAt,
          updatedAt: p.createdAt
        };
        map.set(key, { account: fakeAcc, project: p, contact: fakeContact });
      }
    });

    const list = Array.from(map.values());

    return list.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.account.companyName.toLowerCase().includes(q) ||
        (item.contact?.name && item.contact.name.toLowerCase().includes(q)) ||
        (item.account.segment && item.account.segment.toLowerCase().includes(q)) ||
        (item.contact?.email && item.contact.email.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || item.account.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [accounts, contacts, projects, searchQuery, statusFilter]);

  // Calculate client completion percentage based on active products and stages
  const calculateClientProgress = (project?: Project): number => {
    if (!project) return 25;
    const prods = project.activeProducts || [];
    if (prods.length === 0) return 30;

    let totalScore = 0;
    prods.forEach(prod => {
      const subProds = prod.subProducts || [];
      if (subProds.length > 0) {
        const completedCount = subProds.filter(s => s.status === 'completed').length;
        totalScore += Math.round((completedCount / subProds.length) * 100);
      } else {
        totalScore += prod.status === 'completed' ? 100 : prod.status === 'in_progress' ? 50 : 25;
      }
    });

    return Math.min(100, Math.max(10, Math.round(totalScore / prods.length)));
  };

  // Open Pop-up Modal for a Client
  const handleOpenClientModal = (item: { account: Account; project?: Project; contact?: Contact }, tab: 'cadastro' | 'produtos' | 'financeiro' | 'logo' | 'observacoes' = 'cadastro') => {
    setSelectedClientForModal(item);
    setActivePopupTab(tab);
    setIsEditingInModal(false);

    // Initial packages and solutions
    const sols = item.project?.solutions || item.account.contractedSolutions || ['sharp_brand', 'sharp_presence'];
    const pkgs = item.project?.contractedPackages || item.account.contractedPackages || sols.map(s => getDefaultPackageForSolution(s).id);

    setEditSelectedSolutions(sols);
    setEditContractedPackages(pkgs);

    const pre = calculatePreStipulatedValues(sols, pkgs, officialPackages);

    // Sync form state
    setEditCompanyName(item.account.companyName);
    setEditLegalName(item.account.legalName || '');
    setEditSegment(item.account.segment || 'Serviços & Negócios');
    setEditPhone(item.contact?.phone || item.account.phone || '(19) 9 9568-2110');
    setEditEmail(item.contact?.email || item.project?.clientEmail || '');
    setEditContactName(item.contact?.name || item.project?.clientName || item.account.companyName);
    setEditCnpj(item.account.cnpj || item.project?.cnpj || '');
    setEditAddress(item.account.address || item.project?.address || '');
    
    // Load saved package price overrides
    const savedOverrides = item.account.packagePriceOverrides || item.project?.packagePriceOverrides || {};
    setEditPackagePriceOverrides(savedOverrides);

    // Use saved value or fallback to official pre-stipulated suggested value
    const contractVal = item.account.contractValue !== undefined ? item.account.contractValue : (item.project?.contractValue !== undefined ? item.project.contractValue : pre.suggestedOneTimeContractValue);
    const monthlyVal = item.account.monthlyFee !== undefined ? item.account.monthlyFee : (item.project?.monthlyFee !== undefined ? item.project.monthlyFee : pre.suggestedMonthlyFee);

    setEditContractValue(String(contractVal));
    setEditMonthlyFee(String(monthlyVal));
    setEditNotes(item.account.notes || item.project?.notes || '');
    setEditLogoUrl(item.account.logoUrl || item.project?.logoUrl || '');
    setEditStatus(item.account.status);
  };

  // Open Product Scope & Value Details Pop-up Modal
  const handleOpenPackageDetailModal = (pkg: ServicePackagePricing) => {
    setSelectedPackageForDetailModal(pkg);
    const existing = editPackagePriceOverrides[pkg.id];
    setDetailModalCustomPrice(existing && existing.customPrice !== undefined ? String(existing.customPrice) : String(pkg.suggestedPrice));
    setDetailModalReason(existing?.reason || '');
  };

  // Open Product Scope & Value Details directly from client card
  const handleOpenPackageDetailDirectlyFromCard = (
    item: { account: Account; project?: Project; contact?: Contact },
    pkg: ServicePackagePricing,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    handleOpenClientModal(item, 'financeiro');
    
    // Set direct package modal
    const rawOverrides = (item.project as any)?.packagePriceOverrides || (item.account as any)?.packagePriceOverrides || {};
    const existing = rawOverrides[pkg.id];
    setSelectedPackageForDetailModal(pkg);
    setDetailModalCustomPrice(existing && existing.customPrice !== undefined ? String(existing.customPrice) : String(pkg.suggestedPrice));
    setDetailModalReason(existing?.reason || '');
  };

  // Save Product Details & Custom Price from Pop-up Modal
  const handleSavePackageDetail = () => {
    if (!selectedPackageForDetailModal) return;
    const pkg = selectedPackageForDetailModal;
    const numPrice = parseFloat(detailModalCustomPrice);
    const validPrice = isNaN(numPrice) ? pkg.suggestedPrice : numPrice;
    const reason = detailModalReason.trim();
    const isAltered = validPrice !== pkg.suggestedPrice;

    const updatedOverrides = { ...editPackagePriceOverrides };
    if (!isAltered && !reason) {
      delete updatedOverrides[pkg.id];
    } else {
      updatedOverrides[pkg.id] = {
        customPrice: validPrice,
        reason: reason || (validPrice < pkg.suggestedPrice ? 'Desconto Comercial Aplicado' : 'Acréscimo de Escopo')
      };
    }

    // Auto-recalculate the totals for monthly fee and contract value based on all active packages
    let totalMonthly = 0;
    let totalContract = 0;
    editPreStipulated.matchedPackages.forEach(p => {
      const pOverride = p.id === pkg.id ? (isAltered ? { customPrice: validPrice, reason } : undefined) : updatedOverrides[p.id];
      const price = pOverride && pOverride.customPrice !== undefined ? pOverride.customPrice : p.suggestedPrice;
      if (p.billingType === 'monthly' || p.model === 'recorrente') {
        totalMonthly += price;
      } else {
        totalContract += price;
      }
    });

    setEditPackagePriceOverrides(updatedOverrides);
    setEditMonthlyFee(String(totalMonthly));
    setEditContractValue(String(totalContract));

    // Instantly persist changes to account and project
    if (selectedClientForModal) {
      updateAccount(selectedClientForModal.account.id, {
        packagePriceOverrides: updatedOverrides,
        monthlyFee: totalMonthly,
        contractValue: totalContract
      });

      if (selectedClientForModal.project) {
        updateProject(selectedClientForModal.project.id, {
          packagePriceOverrides: updatedOverrides,
          monthlyFee: totalMonthly,
          contractValue: totalContract
        });
      }

      setSuccessBanner(`Valor do produto "${pkg.name}" atualizado para ${formatBRL(validPrice)} em ${selectedClientForModal.account.companyName}!`);
      setTimeout(() => setSuccessBanner(null), 4000);
    }

    setSelectedPackageForDetailModal(null);
  };

  // Reset product price to official table baseline
  const handleResetPackageDetail = () => {
    if (!selectedPackageForDetailModal) return;
    const pkg = selectedPackageForDetailModal;
    setDetailModalCustomPrice(String(pkg.suggestedPrice));
    setDetailModalReason('');
  };

  // Handle Logo File Upload (via FileReader base64 for instant preview & persistence)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (isNew) {
        setNewLogoUrl(base64);
      } else {
        setEditLogoUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save changes to client in pop-up modal
  const handleSaveClientModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForModal || !editCompanyName.trim()) return;

    const numContract = parseFloat(editContractValue) || 0;
    const numMonthly = parseFloat(editMonthlyFee) || 0;

    // 1. Update Account
    updateAccount(selectedClientForModal.account.id, {
      companyName: editCompanyName.trim(),
      legalName: editLegalName.trim() || undefined,
      segment: editSegment.trim(),
      phone: editPhone.trim(),
      cnpj: editCnpj.trim() || undefined,
      address: editAddress.trim() || undefined,
      logoUrl: editLogoUrl.trim() || undefined,
      contractValue: numContract,
      monthlyFee: numMonthly,
      packagePriceOverrides: editPackagePriceOverrides,
      contractedSolutions: editSelectedSolutions,
      contractedPackages: editContractedPackages,
      notes: editNotes.trim() || undefined,
      status: editStatus
    });

    // 2. Update Primary Contact
    if (selectedClientForModal.contact) {
      updateContact(selectedClientForModal.contact.id, {
        name: editContactName.trim(),
        email: editEmail.trim() || undefined,
        phone: editPhone.trim()
      });
    }

    // 3. Update or Sync Project to keep Operação 100% synchronized
    if (selectedClientForModal.project) {
      updateProject(selectedClientForModal.project.id, {
        companyName: editCompanyName.trim(),
        clientName: editContactName.trim(),
        clientEmail: editEmail.trim(),
        clientPhone: editPhone.trim(),
        segment: editSegment.trim(),
        cnpj: editCnpj.trim() || undefined,
        address: editAddress.trim() || undefined,
        logoUrl: editLogoUrl.trim() || undefined,
        contractValue: numContract,
        monthlyFee: numMonthly,
        packagePriceOverrides: editPackagePriceOverrides,
        contractedPackages: editContractedPackages,
        notes: editNotes.trim() || undefined,
        solutions: editSelectedSolutions
      });
    } else {
      // Create associated project for operation
      const activeProducts: ProjectActiveProduct[] = editSelectedSolutions.map((solId, idx) => {
        const pkg = SHARP_OFFICIAL_PACKAGES.find(p => (p.pillarId === solId || p.solutionId === solId) && editContractedPackages.includes(p.id)) || getDefaultPackageForSolution(solId);
        return {
          id: `prod_${solId}_${Date.now()}_${idx}`,
          solutionId: solId,
          name: solId === 'sharp_brand' ? 'Sharp Brand' : solId === 'sharp_presence' ? 'Sharp Presence' : solId === 'sharp_insights' ? 'Sharp Insights' : 'Sharp Growth',
          packageName: pkg.name,
          status: 'active',
          currentStage: solId === 'sharp_brand' ? 'Criação de Ativos & Brandbook' : 'Produção de Lote & Copys',
          responsibleStaff: solId === 'sharp_growth' ? 'Cristiano (Growth & Mídia)' : solId === 'sharp_insights' ? 'Raphael (Estrategista Chefe)' : 'Luan (Líder de Arte)',
          startDate: new Date().toISOString().split('T')[0],
          deliverablesSummary: `Execução contínua das entregas para ${editCompanyName.trim()}.`,
          subProducts: generateDefaultSubProducts(solId)
        };
      });

      addProject({
        accountId: selectedClientForModal.account.id,
        companyName: editCompanyName.trim(),
        clientName: editContactName.trim() || editCompanyName.trim(),
        clientEmail: editEmail.trim() || `contato@${editCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
        clientPhone: editPhone.trim() || '(19) 9 9568-2110',
        segment: editSegment.trim(),
        cnpj: editCnpj.trim() || undefined,
        address: editAddress.trim() || undefined,
        logoUrl: editLogoUrl.trim() || undefined,
        contractValue: numContract,
        monthlyFee: numMonthly,
        packagePriceOverrides: editPackagePriceOverrides,
        contractedPackages: editContractedPackages,
        notes: editNotes.trim() || undefined,
        solutions: editSelectedSolutions,
        activeProducts,
        stage: 'producao',
        onboardingChecklist: [
          { id: `ob-sync-1-${Date.now()}`, label: 'Coleta de acessos & Briefing validado', completed: true },
          { id: `ob-sync-2-${Date.now()}`, label: 'Definição de personas e referências', completed: true },
          { id: `ob-sync-3-${Date.now()}`, label: 'Planejamento de cronograma operacional', completed: false }
        ],
        assignedTeam: {
          designer: 'Luan (Líder de Arte)',
          strategist: 'Raphael (Estrategista Chefe)',
          commercial: 'Ingrid (Atendimento & CS)'
        },
        contentItems: []
      });
    }

    // Refresh modal state
    setSelectedClientForModal(prev => prev ? {
      ...prev,
      account: {
        ...prev.account,
        companyName: editCompanyName.trim(),
        legalName: editLegalName.trim() || undefined,
        segment: editSegment.trim(),
        phone: editPhone.trim(),
        cnpj: editCnpj.trim() || undefined,
        address: editAddress.trim() || undefined,
        logoUrl: editLogoUrl.trim() || undefined,
        contractValue: numContract,
        monthlyFee: numMonthly,
        notes: editNotes.trim() || undefined,
        status: editStatus
      },
      contact: prev.contact ? {
        ...prev.contact,
        name: editContactName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim()
      } : prev.contact
    } : null);

    setIsEditingInModal(false);
    setSuccessBanner(`Dados do cliente "${editCompanyName.trim()}" atualizados com sucesso e sincronizados na Operação!`);
    setTimeout(() => setSuccessBanner(null), 4500);
  };

  // Create brand new client and immediately sync to Operation
  const handleCreateNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newContactName.trim()) return;

    const numContract = parseFloat(newContractValue) || 0;
    const numMonthly = parseFloat(newMonthlyFee) || 0;

    // 1. Create Account
    const createdAcc = createAccount({
      companyName: newCompanyName.trim(),
      legalName: newLegalName.trim() || undefined,
      segment: newSegment.trim() || 'Serviços & Negócios',
      phone: newCompanyPhone.trim() || '(19) 9 9568-2110',
      cnpj: newCnpj.trim() || undefined,
      address: newAddress.trim() || undefined,
      logoUrl: newLogoUrl.trim() || undefined,
      contractValue: numContract,
      monthlyFee: numMonthly,
      contractedSolutions: newSolutions,
      contractedPackages: newContractedPackages,
      notes: newNotes.trim() || undefined,
      status: 'active'
    });

    // 2. Create Primary Contact
    const createdContact = createContact({
      accountId: createdAcc.id,
      name: newContactName.trim(),
      email: newContactEmail.trim() || `contato@${newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
      phone: newCompanyPhone.trim() || '(19) 9 9568-2110',
      role: 'Responsável Principal',
      isPrimary: true,
      status: 'active'
    });

    // 3. Create synchronized Project for Operation
    const activeProducts: ProjectActiveProduct[] = newSolutions.map((solId, idx) => {
      const pkg = SHARP_OFFICIAL_PACKAGES.find(p => (p.pillarId === solId || p.solutionId === solId) && newContractedPackages.includes(p.id)) || getDefaultPackageForSolution(solId);
      return {
        id: `prod_${solId}_${Date.now()}_${idx}`,
        solutionId: solId,
        name: solId === 'sharp_brand' ? 'Sharp Brand' : solId === 'sharp_presence' ? 'Sharp Presence' : solId === 'sharp_insights' ? 'Sharp Insights' : 'Sharp Growth',
        packageName: pkg.name,
        status: 'active',
        currentStage: solId === 'sharp_brand' ? 'Criação de Ativos & Brandbook' : 'Produção de Lote & Copys',
        responsibleStaff: solId === 'sharp_growth' ? 'Cristiano (Growth & Mídia)' : solId === 'sharp_insights' ? 'Raphael (Estrategista Chefe)' : 'Luan (Líder de Arte)',
        startDate: new Date().toISOString().split('T')[0],
        deliverablesSummary: `Execução contínua das entregas para ${newCompanyName.trim()}.`,
        subProducts: generateDefaultSubProducts(solId)
      };
    });

    addProject({
      accountId: createdAcc.id,
      companyName: newCompanyName.trim(),
      clientName: newContactName.trim(),
      clientEmail: newContactEmail.trim() || `contato@${newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
      clientPhone: newCompanyPhone.trim() || '(19) 9 9568-2110',
      segment: newSegment.trim(),
      cnpj: newCnpj.trim() || undefined,
      address: newAddress.trim() || undefined,
      logoUrl: newLogoUrl.trim() || undefined,
      contractValue: numContract,
      monthlyFee: numMonthly,
      contractedPackages: newContractedPackages,
      notes: newNotes.trim() || undefined,
      solutions: newSolutions,
      activeProducts,
      stage: 'producao',
      onboardingChecklist: [
        { id: `ob-new-1-${Date.now()}`, label: 'Coleta de acessos & Briefing validado', completed: true },
        { id: `ob-new-2-${Date.now()}`, label: 'Definição de personas e referências', completed: true },
        { id: `ob-new-3-${Date.now()}`, label: 'Planejamento de cronograma operacional', completed: false }
      ],
      assignedTeam: {
        designer: 'Luan (Líder de Arte)',
        strategist: 'Raphael (Estrategista Chefe)',
        commercial: 'Ingrid (Atendimento & CS)'
      },
      contentItems: []
    });

    // Reset Form
    setNewCompanyName('');
    setNewLegalName('');
    setNewSegment('Serviços & Negócios');
    setNewCompanyPhone('');
    setNewContactName('');
    setNewContactEmail('');
    setNewCnpj('');
    setNewAddress('');
    setNewContractValue('2990');
    setNewMonthlyFee('1790');
    setNewNotes('');
    setNewLogoUrl('');
    setNewSolutions(['sharp_brand', 'sharp_presence']);
    setNewContractedPackages(['brand_strategy', 'presence_strategic']);
    setShowNewClientModal(false);

    setSuccessBanner(`Cliente "${createdAcc.companyName}" cadastrado com sucesso e integrado à Operação!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const toggleSolutionInEdit = (solId: SolutionId) => {
    setEditSelectedSolutions(prev => {
      const exists = prev.includes(solId);
      const nextSols = exists ? prev.filter(s => s !== solId) : [...prev, solId];
      // Sync packages
      if (!exists) {
        const defaultPkg = getDefaultPackageForSolution(solId);
        setEditContractedPackages(p => [...p.filter(pkgId => !SHARP_OFFICIAL_PACKAGES.find(op => op.id === pkgId && (op.pillarId === solId || op.solutionId === solId))), defaultPkg.id]);
      } else {
        setEditContractedPackages(p => p.filter(pkgId => !SHARP_OFFICIAL_PACKAGES.find(op => op.id === pkgId && (op.pillarId === solId || op.solutionId === solId))));
      }
      return nextSols;
    });
  };

  const selectPackageInEdit = (solId: SolutionId, pkgId: string) => {
    if (!editSelectedSolutions.includes(solId)) {
      setEditSelectedSolutions(prev => [...prev, solId]);
    }
    setEditContractedPackages(prev => {
      // Remove other packages for the same solution and add this one
      const filtered = prev.filter(pId => !SHARP_OFFICIAL_PACKAGES.find(op => op.id === pId && (op.pillarId === solId || op.solutionId === solId)));
      return [...filtered, pkgId];
    });
  };

  const toggleSolutionInNew = (solId: SolutionId) => {
    setNewSolutions(prev => {
      const exists = prev.includes(solId);
      const nextSols = exists ? prev.filter(s => s !== solId) : [...prev, solId];
      if (!exists) {
        const defaultPkg = getDefaultPackageForSolution(solId);
        setNewContractedPackages(p => [...p.filter(pkgId => !SHARP_OFFICIAL_PACKAGES.find(op => op.id === pkgId && (op.pillarId === solId || op.solutionId === solId))), defaultPkg.id]);
      } else {
        setNewContractedPackages(p => p.filter(pkgId => !SHARP_OFFICIAL_PACKAGES.find(op => op.id === pkgId && (op.pillarId === solId || op.solutionId === solId))));
      }
      return nextSols;
    });
  };

  const selectPackageInNew = (solId: SolutionId, pkgId: string) => {
    if (!newSolutions.includes(solId)) {
      setNewSolutions(prev => [...prev, solId]);
    }
    setNewContractedPackages(prev => {
      const filtered = prev.filter(pId => !SHARP_OFFICIAL_PACKAGES.find(op => op.id === pId && (op.pillarId === solId || op.solutionId === solId)));
      return [...filtered, pkgId];
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-slate-800">
      
      {/* Toast Notification Banner */}
      {successBanner && (
        <div className="fixed top-20 right-6 z-50 bg-white text-slate-900 px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-200 animate-slideDown">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">{successBanner}</p>
            <p className="text-[10px] text-slate-500">Dados cadastrais, logo, produtos e valores atualizados.</p>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-slate-400 hover:text-slate-700 text-xs ml-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-50 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                GESTÃO DE CLIENTES & CONTAS
              </span>
              <span className="text-slate-500 text-xs font-medium">• Cards Editáveis & Sincronização em Tempo Real</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clientes & Contas Cadastradas
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed">
              Visualize cada cliente em cards inteligentes e editáveis. Clique em qualquer card para abrir o pop-up com os menus completos: dados cadastrais, upload de logo, produtos ativos, valores fechados, mensalidade e observações da equipe.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start md:self-auto">
            <button
              onClick={() => setShowNewClientModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Cliente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search, Filter Bar & View Toggle */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente por empresa, responsável, e-mail ou segmento..."
              className="w-full pl-10 pr-4 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Status Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {[
              { id: 'all', label: `Todos (${clientCards.length})` },
              { id: 'active', label: 'Ativos' },
              { id: 'inactive', label: 'Inativos' },
              { id: 'archived', label: 'Arquivados' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-cyan-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CLIENTS EDITABLE CARDS GRID */}
      {clientCards.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Nenhum cliente encontrado</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Não encontramos clientes cadastrados com os filtros atuais. Clique em "+ Novo Cliente" para adicionar um cliente.
          </p>
          <button
            onClick={() => setShowNewClientModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Primeiro Cliente</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clientCards.map(({ account, project, contact }) => {
            const progress = calculateClientProgress(project);
            const activeProds = project?.activeProducts || [];
            const sols = project?.solutions || account.contractedSolutions || ['sharp_brand', 'sharp_presence'];
            const pkgs = project?.contractedPackages || account.contractedPackages || [];
            
            // Calculate official pre-stipulated values from attachments
            const pre = calculatePreStipulatedValues(sols, pkgs, officialPackages);

            const contractVal = account.contractValue !== undefined ? account.contractValue : (project?.contractValue !== undefined ? project.contractValue : pre.suggestedOneTimeContractValue);
            const monthlyVal = account.monthlyFee !== undefined ? account.monthlyFee : (project?.monthlyFee !== undefined ? project.monthlyFee : pre.suggestedMonthlyFee);
            const logo = account.logoUrl || project?.logoUrl;

            const isMatchingOfficial = (monthlyVal === pre.suggestedMonthlyFee) && (contractVal === pre.suggestedOneTimeContractValue);

            return (
              <div
                key={account.id}
                onClick={() => handleOpenClientModal({ account, project, contact })}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-cyan-400/80 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Card Info */}
                <div className="space-y-3.5">
                  
                  {/* Header with Logo, Name and Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Logo or Initial Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-extrabold text-lg shrink-0 overflow-hidden shadow-2xs group-hover:border-cyan-300 transition-colors">
                        {logo ? (
                          <img
                            src={logo}
                            alt={account.companyName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-cyan-700 bg-cyan-50 w-full h-full flex items-center justify-center font-black text-base">
                            {account.companyName.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors truncate">
                          {account.companyName}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                          {contact?.name || project?.clientName || 'Responsável não informado'}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      account.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : account.status === 'archived'
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {account.status === 'active' ? 'Ativo' : account.status === 'archived' ? 'Arquivado' : 'Inativo'}
                    </span>
                  </div>

                  {/* Segment Badge & Contact Info */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                    {account.segment && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {account.segment}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{contact?.phone || account.phone || '(19) 9 9568-2110'}</span>
                    </span>
                  </div>

                  {/* Contracted Products - Clean & Concise */}
                  {pre.matchedPackages.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {pre.matchedPackages.map((pkg, idx) => {
                        const solId = pkg.pillarId || pkg.solutionId || 'sharp_presence';
                        const theme = getProductColorTheme(solId);
                        const isMonthly = pkg.model === 'recorrente' || pkg.billingType === 'monthly' || pkg.periodLabel === '/mês';
                        
                        const rawOverrides = (project as any)?.packagePriceOverrides || (account as any)?.packagePriceOverrides || {};
                        const pkgOverride = rawOverrides[pkg.id];
                        const effectivePrice = pkgOverride && pkgOverride.customPrice !== undefined ? pkgOverride.customPrice : pkg.suggestedPrice;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => handleOpenPackageDetailDirectlyFromCard({ account, project, contact }, pkg, e)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border flex items-center space-x-1.5 transition-all cursor-pointer hover:opacity-90 ${theme.pillBg} ${theme.pillText} ${theme.pillBorder}`}
                            title={`Editar valor de "${pkg.name}" (${formatBRL(effectivePrice)})`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                            <span>{pkg.name}</span>
                            <span className="font-bold opacity-80">{formatBRL(effectivePrice)}{isMonthly ? '/m' : ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Financial Values - Clean, Direct & Focused purely on values */}
                  <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Mensalidade
                      </span>
                      <span className="text-sm font-black text-cyan-700 block mt-0.5">
                        {monthlyVal > 0 ? `${formatBRL(monthlyVal)}/mês` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Contrato / Setup
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                        {contractVal > 0 ? formatBRL(contractVal) : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Operational Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-500">Conclusão na Operação</span>
                      <span className="text-xs font-black text-slate-800">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Notes Preview if available */}
                  {(account.notes || project?.notes) && (
                    <p className="text-[11px] text-slate-500 italic bg-amber-50/50 border border-amber-100 rounded-xl p-2 line-clamp-2">
                      📝 {account.notes || project?.notes}
                    </p>
                  )}
                </div>

                {/* Card Action Footer with Edit, Archive & Delete per user prompt */}
                <div className="pt-3.5 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenClientModal({ account, project, contact })}
                    className="text-[11px] font-bold text-cyan-700 hover:text-cyan-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Abrir Dossiê & Menus</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleOpenClientModal({ account, project, contact })}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Editar cliente"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClientActionModal({
                          isOpen: true,
                          type: account.status === 'archived' ? 'restore' : 'archive',
                          clientName: account.companyName,
                          accountId: account.id
                        });
                      }}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title={account.status === 'archived' ? 'Desarquivar cliente' : 'Arquivar cliente'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClientActionModal({
                          isOpen: true,
                          type: 'delete',
                          clientName: account.companyName,
                          accountId: account.id
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir ou arquivar cliente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* POP-UP MODAL: CLIENT FULL MENUS & EDITABLE DOSSIER                         */}
      {/* ========================================================================= */}
      {selectedClientForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-5 shadow-2xl my-6 text-slate-800 animate-scaleIn max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xl shrink-0 overflow-hidden shadow-2xs">
                  {editLogoUrl ? (
                    <img
                      src={editLogoUrl}
                      alt={selectedClientForModal.account.companyName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-cyan-700 bg-cyan-50 w-full h-full flex items-center justify-center font-black text-lg">
                      {selectedClientForModal.account.companyName.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                      {selectedClientForModal.account.companyName}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      editStatus === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : editStatus === 'archived'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {editStatus === 'active' ? 'Ativo' : editStatus === 'archived' ? 'Arquivado' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Contato: <strong className="text-slate-700">{editContactName || selectedClientForModal.account.companyName}</strong> • {editEmail || 'E-mail não informado'} • {editPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    setClientActionModal({
                      isOpen: true,
                      type: selectedClientForModal.account.status === 'archived' ? 'restore' : 'archive',
                      clientName: selectedClientForModal.account.companyName,
                      accountId: selectedClientForModal.account.id
                    });
                  }}
                  className="p-2 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                  title={selectedClientForModal.account.status === 'archived' ? 'Restaurar Cliente' : 'Arquivar Cliente'}
                >
                  <Archive className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setClientActionModal({
                      isOpen: true,
                      type: 'delete',
                      clientName: selectedClientForModal.account.companyName,
                      accountId: selectedClientForModal.account.id
                    });
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Excluir Cliente"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSaveClientModal}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar</span>
                </button>
                <button
                  onClick={() => setSelectedClientForModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Fechar Pop-up"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pop-up Tabs Navigation */}
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2 overflow-x-auto scrollbar-none shrink-0 text-xs">
              <button
                onClick={() => setActivePopupTab('cadastro')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  activePopupTab === 'cadastro'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>1. Dados Cadastrais</span>
              </button>

              <button
                onClick={() => setActivePopupTab('logo')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  activePopupTab === 'logo'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>2. Logo do Cliente</span>
              </button>

              <button
                onClick={() => setActivePopupTab('produtos')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  activePopupTab === 'produtos'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3. Produtos Ativos</span>
              </button>

              <button
                onClick={() => setActivePopupTab('financeiro')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  activePopupTab === 'financeiro'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>4. Valores & Mensalidade</span>
              </button>

              <button
                onClick={() => setActivePopupTab('observacoes')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  activePopupTab === 'observacoes'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>5. Observações da Equipe</span>
              </button>
            </div>

            {/* Pop-up Content Body */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-5">
              
              {/* TAB 1: DADOS CADASTRAIS */}
              {activePopupTab === 'cadastro' && (
                <form onSubmit={handleSaveClientModal} className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nome da Empresa / Marca *
                      </label>
                      <input
                        type="text"
                        value={editCompanyName}
                        onChange={(e) => setEditCompanyName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Razão Social (Opcional)
                      </label>
                      <input
                        type="text"
                        value={editLegalName}
                        onChange={(e) => setEditLegalName(e.target.value)}
                        placeholder="Ex: Lumina Odontologia LTDA"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contato / Responsável *
                      </label>
                      <input
                        type="text"
                        value={editContactName}
                        onChange={(e) => setEditContactName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        E-mail de Contato
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Segmento de Atuação
                      </label>
                      <input
                        type="text"
                        value={editSegment}
                        onChange={(e) => setEditSegment(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        CNPJ (Opcional)
                      </label>
                      <input
                        type="text"
                        value={editCnpj}
                        onChange={(e) => setEditCnpj(e.target.value)}
                        placeholder="00.000.000/0001-00"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Endereço / Cidade (Opcional)
                      </label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="Av. Paulista, 1000 - São Paulo, SP"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Dados Cadastrais</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: LOGO DO CLIENTE */}
              {activePopupTab === 'logo' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                    <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center mx-auto overflow-hidden shadow-xs">
                      {editLogoUrl ? (
                        <img
                          src={editLogoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-slate-300" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Logotipo Oficial do Cliente</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Faça upload da imagem do logo para ser exibida nos cards, dossiês e materiais de aprovação.
                      </p>
                    </div>

                    <div className="flex items-center justify-center space-x-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e, false)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Imagem do Computador</span>
                      </button>

                      {editLogoUrl && (
                        <button
                          type="button"
                          onClick={() => setEditLogoUrl('')}
                          className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Remover Logo
                        </button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 max-w-md mx-auto">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1 text-left">
                        Ou insira a URL da imagem da Logo:
                      </label>
                      <input
                        type="url"
                        value={editLogoUrl}
                        onChange={(e) => setEditLogoUrl(e.target.value)}
                        placeholder="https://exemplo.com/logo.png"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveClientModal}
                      className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Logo</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUTOS ATIVOS */}
              {activePopupTab === 'produtos' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold flex items-center space-x-2 text-slate-900">
                        <Tag className="w-4 h-4 text-cyan-700" />
                        <span>Produtos Ativos & Soluções Oficiais Sharp</span>
                      </p>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                        {editSelectedSolutions.length} Soluções Contratadas
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Gerencie as soluções e o pacote contratado para este cliente. Os valores financeiros e mensalidades são gerenciados exclusivamente na aba <strong>Valores & Mensalidade</strong>.
                    </p>
                  </div>

                  {/* Solutions & Packages Selector Grid (Pure Products without prices) */}
                  <div className="space-y-3.5">
                    {SHARP_SOLUTIONS.map(sol => {
                      const isSelected = editSelectedSolutions.includes(sol.id);
                      const availablePackages = getPackagesForSolution(sol.id);

                      return (
                        <div
                          key={sol.id}
                          className={`rounded-2xl border transition-all p-4 ${
                            isSelected
                              ? 'bg-white border-cyan-300 shadow-xs ring-1 ring-cyan-400/30'
                              : 'bg-slate-50/70 border-slate-200/90 opacity-80 hover:opacity-100'
                          }`}
                        >
                          {/* Solution Header */}
                          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSolutionInEdit(sol.id)}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-cyan-600 text-white shadow-2xs' : 'border border-slate-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">{sol.name}</h4>
                                <p className="text-[11px] text-slate-500">{sol.tagline}</p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {sol.category}
                            </span>
                          </div>

                          {/* Tier Packages Selection (Pure Products - No Values) */}
                          {isSelected && availablePackages.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Escolha o Nível / Escopo do Pacote:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {availablePackages.map(pkg => {
                                  const isPkgActive = editContractedPackages.includes(pkg.id);
                                  return (
                                    <div
                                      key={pkg.id}
                                      onClick={() => selectPackageInEdit(sol.id, pkg.id)}
                                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                        isPkgActive
                                          ? 'bg-cyan-50/90 border-cyan-400 ring-1 ring-cyan-500/20 text-cyan-950 shadow-2xs'
                                          : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] font-bold">{pkg.name}</span>
                                        {isPkgActive && <Check className="w-3.5 h-3.5 text-cyan-700" />}
                                      </div>
                                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight mb-2">
                                        {pkg.tagline}
                                      </p>
                                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                                        <span className="text-slate-400 font-medium">{pkg.includes.length} entregáveis oficiais</span>
                                        <span className="font-semibold text-cyan-800">{pkg.billingType === 'monthly' ? 'Recorrente Mensal' : 'Setup / Pontual'}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Callout to Financials */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-cyan-300">Valores e Mensalidades dos Produtos</p>
                        <p className="text-[11px] text-slate-300">
                          Configure valores oficiais, mensalidades e descontos/acréscimos na aba <strong>Valores & Mensalidade</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setActivePopupTab('financeiro')}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <span>Acessar Valores & Mensalidade</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VALORES E MENSALIDADES */}
              {activePopupTab === 'financeiro' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Summary Cards - Direct, Clean & Focused purely on values */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Mensalidade Total (R$/mês)
                        </label>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100/80 text-cyan-800 border border-cyan-200">
                          Recorrente Mensal
                        </span>
                      </div>
                      <div className="relative mt-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">R$</span>
                        <input
                          type="number"
                          value={editMonthlyFee}
                          onChange={(e) => setEditMonthlyFee(e.target.value)}
                          placeholder="0"
                          className="w-full pl-10 pr-4 py-2.5 text-lg font-black text-cyan-800 bg-white border border-cyan-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Total 1º Mês / Projeto (R$)
                        </label>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 border border-slate-300">
                          Setup / Diagnóstico / Entrada
                        </span>
                      </div>
                      <div className="relative mt-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">R$</span>
                        <input
                          type="number"
                          value={editContractValue}
                          onChange={(e) => setEditContractValue(e.target.value)}
                          placeholder="0"
                          className="w-full pl-10 pr-4 py-2.5 text-lg font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clean Contracted Products Breakdown */}
                  {editPreStipulated.matchedPackages.length > 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                      <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Detalhamento por Produto Contratado ({editPreStipulated.matchedPackages.length})
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Produtos vinculados à conta com indicação de mensalidade e valor de 1º mês / projeto
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditContractValue(String(editPreStipulated.suggestedOneTimeContractValue));
                            setEditMonthlyFee(String(editPreStipulated.suggestedMonthlyFee));
                            setEditPackagePriceOverrides({});
                          }}
                          className="text-[11px] font-bold text-cyan-700 hover:text-cyan-800 flex items-center space-x-1.5 px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100/80 rounded-lg transition-all cursor-pointer border border-cyan-200"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Restaurar Valores Oficiais</span>
                        </button>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {editPreStipulated.matchedPackages.map((pkg) => {
                          const isMonthly = pkg.hasMonthlyFee ?? (pkg.model === 'recorrente' || pkg.billingType === 'monthly' || pkg.periodLabel === '/mês');
                          const defaultProjectPrice = pkg.firstMonthSetupPrice !== undefined ? pkg.firstMonthSetupPrice : (!isMonthly ? pkg.suggestedPrice : 0);
                          const defaultMonthlyPrice = pkg.monthlyPrice !== undefined ? pkg.monthlyPrice : (isMonthly ? pkg.suggestedPrice : 0);
                          
                          const override = editPackagePriceOverrides[pkg.id];
                          const currentMonthlyPrice = override && override.customMonthlyPrice !== undefined ? override.customMonthlyPrice : (override && override.customPrice !== undefined && isMonthly ? override.customPrice : defaultMonthlyPrice);
                          const currentProjectPrice = override && override.customSetupPrice !== undefined ? override.customSetupPrice : (override && override.customPrice !== undefined && !isMonthly ? override.customPrice : defaultProjectPrice);

                          return (
                            <div key={pkg.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-black text-slate-900 truncate">
                                    {pkg.name}
                                  </span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                    isMonthly ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}>
                                    {isMonthly ? 'Com Mensalidade' : 'Projeto Pontual'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1">
                                  {pkg.tagline}
                                </p>
                              </div>

                              <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                                {/* Project / 1st month value */}
                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    1º Mês / Setup
                                  </span>
                                  <div className="relative w-28 mt-0.5">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">R$</span>
                                    <input
                                      type="number"
                                      value={currentProjectPrice}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setEditPackagePriceOverrides(prev => {
                                          const updated = {
                                            ...prev,
                                            [pkg.id]: {
                                              ...prev[pkg.id],
                                              customSetupPrice: val,
                                              customPrice: isMonthly ? currentMonthlyPrice : val
                                            }
                                          };
                                          
                                          // Recalculate contract total
                                          let totalContract = 0;
                                          editPreStipulated.matchedPackages.forEach(p => {
                                            const pIsMonthly = p.hasMonthlyFee ?? (p.model === 'recorrente' || p.billingType === 'monthly');
                                            const pDefProj = p.firstMonthSetupPrice !== undefined ? p.firstMonthSetupPrice : (!pIsMonthly ? p.suggestedPrice : 0);
                                            const pOverride = updated[p.id];
                                            const pVal = pOverride && pOverride.customSetupPrice !== undefined ? pOverride.customSetupPrice : pDefProj;
                                            totalContract += pVal;
                                          });
                                          setEditContractValue(String(totalContract));

                                          return updated;
                                        });
                                      }}
                                      className="w-full pl-6 pr-2 py-1 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>

                                {/* Monthly Fee Value */}
                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Mensalidade
                                  </span>
                                  <div className="relative w-28 mt-0.5">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">R$</span>
                                    <input
                                      type="number"
                                      disabled={!isMonthly}
                                      value={isMonthly ? currentMonthlyPrice : 0}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setEditPackagePriceOverrides(prev => {
                                          const updated = {
                                            ...prev,
                                            [pkg.id]: {
                                              ...prev[pkg.id],
                                              customMonthlyPrice: val,
                                              customPrice: val
                                            }
                                          };
                                          
                                          // Recalculate monthly total
                                          let totalMonthly = 0;
                                          editPreStipulated.matchedPackages.forEach(p => {
                                            const pIsMonthly = p.hasMonthlyFee ?? (p.model === 'recorrente' || p.billingType === 'monthly');
                                            if (pIsMonthly) {
                                              const pDefMonth = p.monthlyPrice !== undefined ? p.monthlyPrice : p.suggestedPrice;
                                              const pOverride = updated[p.id];
                                              const pVal = pOverride && pOverride.customMonthlyPrice !== undefined ? pOverride.customMonthlyPrice : pDefMonth;
                                              totalMonthly += pVal;
                                            }
                                          });
                                          setEditMonthlyFee(String(totalMonthly));

                                          return updated;
                                        });
                                      }}
                                      className="w-full pl-6 pr-2 py-1 text-xs font-black text-cyan-800 bg-cyan-50/40 border border-cyan-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-cyan-500/20 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleOpenPackageDetailModal(pkg)}
                                  className="p-1.5 text-slate-400 hover:text-cyan-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer self-end mb-0.5"
                                  title="Ver entregáveis e escopo"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
                      <Tag className="w-8 h-8 text-slate-400 mx-auto" />
                      <h4 className="text-xs font-bold text-slate-700">Nenhum produto ativado para este cliente</h4>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Selecione as soluções e pacotes contratados na aba <strong>Produtos Ativos</strong> para calcular os valores automaticamente.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActivePopupTab('produtos')}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1 mt-1"
                      >
                        <span>Ir para Produtos Ativos</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClientForModal(null);
                        setActiveNavTab('financial');
                      }}
                      className="text-xs font-bold text-cyan-700 hover:text-cyan-800 hover:underline flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Abrir Painel Financeiro Geral</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveClientModal}
                      className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Valores</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: OBSERVAÇÕES & NOTAS DA EQUIPE */}
              {activePopupTab === 'observacoes' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Observações & Notas Internas da Equipe Sharp
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Espaço livre para anotações de alinhamentos, particularidades do cliente, tom de voz, regras específicas ou histórico de reuniões.
                    </p>
                    <textarea
                      rows={6}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Ex: Cliente prefere aprovações via WhatsApp às terças-feiras. Foco prioritário no fortalecimento da marca para médicos parceiros..."
                      className="w-full p-3.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 leading-relaxed placeholder:text-slate-400"
                    />
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveClientModal}
                      className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Observações</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POP-UP MODAL: DETALHES DO PRODUTO ATIVO, ESCOPO DE ENTREGAS & RESUMO DE VALOR */}
      {/* ========================================================================= */}
      {selectedPackageForDetailModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-5 shadow-2xl animate-scaleIn max-h-[92vh] flex flex-col text-slate-800">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-200">
                      {selectedPackageForDetailModal.pillarId === 'sharp_brand' ? 'Sharp Brand' : selectedPackageForDetailModal.pillarId === 'sharp_presence' ? 'Sharp Presence' : selectedPackageForDetailModal.pillarId === 'sharp_insights' ? 'Sharp Insights' : 'Sharp Growth'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {selectedPackageForDetailModal.billingType === 'monthly' ? 'Assinatura Recorrente' : 'Setup / Pontual'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedPackageForDetailModal.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedPackageForDetailModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-4">
              
              {/* Product Tagline & Focus */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1.5">
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {selectedPackageForDetailModal.tagline}
                </p>
                <p className="text-[11px] text-slate-500">
                  <strong className="text-slate-700">Foco do Pacote:</strong> {selectedPackageForDetailModal.focus}
                </p>
              </div>

              {/* 1. O Que Deverá Ser Entregue (Escopo Oficial) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <ListChecks className="w-4 h-4 text-cyan-700" />
                    <span>O Que Deverá Ser Entregue (Anexo Oficial Sharp)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {selectedPackageForDetailModal.includes.length} Entregáveis
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 shadow-2xs">
                  {selectedPackageForDetailModal.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Resumo do Valor & Ajuste Financeiro */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-cyan-700" />
                  <span>Resumo do Valor & Negociação</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Valor Pré-Estipulado Oficial
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-base font-black text-slate-800">
                        {formatBRL(selectedPackageForDetailModal.suggestedPrice)}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {selectedPackageForDetailModal.billingType === 'monthly' ? '/mês' : ' (único)'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Tabela Oficial dos Anexos</span>
                  </div>

                  <div className="bg-cyan-50/70 border border-cyan-200 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-900 uppercase tracking-wider block">
                      Valor Final Negociado (R$)
                    </span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                      <input
                        type="number"
                        value={detailModalCustomPrice}
                        onChange={(e) => setDetailModalCustomPrice(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-sm font-black text-cyan-900 bg-white border border-cyan-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time Delta Status */}
                {(() => {
                  const numP = parseFloat(detailModalCustomPrice);
                  const validP = isNaN(numP) ? selectedPackageForDetailModal.suggestedPrice : numP;
                  const delta = validP - selectedPackageForDetailModal.suggestedPrice;
                  const percent = selectedPackageForDetailModal.suggestedPrice > 0 ? ((delta / selectedPackageForDetailModal.suggestedPrice) * 100).toFixed(1) : '0';

                  if (delta === 0) {
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                        <span className="font-medium">Status do Valor:</span>
                        <span className="font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">Valor Oficial Padrão</span>
                      </div>
                    );
                  }

                  const isDiscount = delta < 0;
                  return (
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      isDiscount ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-indigo-50 border-indigo-300 text-indigo-950'
                    }`}>
                      <span className="font-medium">
                        {isDiscount ? 'Desconto Aplicado:' : 'Acréscimo de Escopo:'}
                      </span>
                      <span className={`font-black px-2 py-0.5 rounded-md ${
                        isDiscount ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {isDiscount ? `-${formatBRL(Math.abs(delta))} (${percent}%)` : `+${formatBRL(delta)} (+${percent}%)`}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* 3. Motivo da Alteração do Valor */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900">
                    Motivo da Alteração de Valor (Tanto para mais quanto para menos)
                  </label>
                  <span className="text-[10px] text-slate-400 italic">Transparência comercial</span>
                </div>

                {/* Quick Presets for Reasons */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Desconto Comercial Concedido',
                    'Acréscimo de Reels / Criativos',
                    'Escopo Reduzido Personalizado',
                    'Parceria Estratégica',
                    'Pagamento Anual Antecipado',
                    'Negociação Especial de Entrada'
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setDetailModalReason(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                        detailModalReason === preset
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={detailModalReason}
                  onChange={(e) => setDetailModalReason(e.target.value)}
                  placeholder="Descreva o motivo detalhado caso haja alteração no valor..."
                  className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 leading-relaxed"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 shrink-0">
              <button
                type="button"
                onClick={handleResetPackageDetail}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Restaurar Tabela Oficial
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedPackageForDetailModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSavePackageDetail}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar & Aplicar Ajuste</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVO CLIENTE (CADASTRO COMPLETO INTEGRADO)                          */}
      {/* ========================================================================= */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-5 sm:p-7 space-y-5 shadow-2xl my-6 text-slate-800 animate-scaleIn max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Cadastrar Novo Cliente
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preencha os dados cadastrais, logo, produtos ativos e valores contratados.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNewClientModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateNewClient} className="overflow-y-auto pr-1 flex-1 space-y-5">
              
              {/* 1. Dados Principais */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Dados da Empresa & Contato
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome da Empresa / Marca *
                    </label>
                    <input
                      type="text"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Ex: Lumina Odontologia"
                      required
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Razão Social (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newLegalName}
                      onChange={(e) => setNewLegalName(e.target.value)}
                      placeholder="Ex: Lumina Odontologia LTDA"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contato / Responsável *
                    </label>
                    <input
                      type="text"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      placeholder="Ex: Dra. Camila Santos"
                      required
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      E-mail do Responsável
                    </label>
                    <input
                      type="email"
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      placeholder="contato@luminaodonto.com.br"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={newCompanyPhone}
                      onChange={(e) => setNewCompanyPhone(e.target.value)}
                      placeholder="(19) 9 9568-2110"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Segmento
                    </label>
                    <input
                      type="text"
                      value={newSegment}
                      onChange={(e) => setNewSegment(e.target.value)}
                      placeholder="Odontologia & Saúde"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Logo Upload */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  2. Logotipo do Cliente
                </h4>
                <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                    {newLogoUrl ? (
                      <img src={newLogoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={newClientFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, true)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => newClientFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Selecionar Arquivo de Logo
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Produtos Ativos & Pacotes Oficiais */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    3. Produtos & Pacotes Contratados (Anexos Sharp)
                  </h4>
                  <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {newSolutions.length} Soluções Selecionadas
                  </span>
                </div>

                <div className="space-y-2.5">
                  {SHARP_SOLUTIONS.map(sol => {
                    const isSel = newSolutions.includes(sol.id);
                    const availablePackages = getPackagesForSolution(sol.id);

                    return (
                      <div
                        key={sol.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          isSel ? 'bg-white border-cyan-300 shadow-2xs ring-1 ring-cyan-400/20' : 'bg-slate-50 border-slate-200 opacity-75'
                        }`}
                      >
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSolutionInNew(sol.id)}>
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                              isSel ? 'bg-cyan-600 text-white' : 'border border-slate-300 bg-white'
                            }`}>
                              {isSel && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-xs font-bold text-slate-900">{sol.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{sol.tagline}</span>
                        </div>

                        {isSel && availablePackages.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                            {availablePackages.map(pkg => {
                              const isPkgActive = newContractedPackages.includes(pkg.id);
                              return (
                                <button
                                  key={pkg.id}
                                  type="button"
                                  onClick={() => selectPackageInNew(sol.id, pkg.id)}
                                  className={`p-2 rounded-xl text-left border text-xs cursor-pointer transition-all ${
                                    isPkgActive
                                      ? 'bg-cyan-50 border-cyan-400 text-cyan-950 font-bold shadow-2xs'
                                      : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span>{pkg.name}</span>
                                    {isPkgActive && <Check className="w-3 h-3 text-cyan-700" />}
                                  </div>
                                  <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                                    {pkg.includes.length} entregáveis • {pkg.billingType === 'monthly' ? 'Recorrente' : 'Setup'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Valores Financeiros com Pré-Estipulado Oficial */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="bg-cyan-50/70 border border-cyan-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-950 flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Valor Pré-Estipulado Oficial:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewContractValue(String(newPreStipulated.suggestedOneTimeContractValue));
                        setNewMonthlyFee(String(newPreStipulated.suggestedMonthlyFee));
                      }}
                      className="text-[10px] font-bold text-cyan-700 hover:text-cyan-900 underline cursor-pointer"
                    >
                      Copiar da Tabela Oficial
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="text-slate-700">
                      Mensalidade sugerida: <strong className="text-cyan-800 font-extrabold">{formatBRL(newPreStipulated.suggestedMonthlyFee)}/mês</strong>
                    </span>
                    <span className="text-slate-700">
                      Setup sugerido: <strong className="text-slate-900 font-extrabold">{formatBRL(newPreStipulated.suggestedOneTimeContractValue)}</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Valor Fechado / Contrato Total (R$) *
                    </label>
                    <input
                      type="number"
                      value={newContractValue}
                      onChange={(e) => setNewContractValue(e.target.value)}
                      placeholder={String(newPreStipulated.suggestedOneTimeContractValue || 2990)}
                      className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20"
                    />
                    <span className="text-[10px] text-slate-400">Editável em caso de negociação</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mensalidade / Recorrência (R$/mês) *
                    </label>
                    <input
                      type="number"
                      value={newMonthlyFee}
                      onChange={(e) => setNewMonthlyFee(e.target.value)}
                      placeholder={String(newPreStipulated.suggestedMonthlyFee || 1790)}
                      className="w-full px-3.5 py-2 text-xs font-bold text-cyan-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20"
                    />
                    <span className="text-[10px] text-slate-400">Editável em caso de negociação</span>
                  </div>
                </div>
              </div>

              {/* 5. Observações */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  5. Observações Iniciais
                </h4>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Anotações gerais sobre o cliente e diretrizes da equipe..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Cadastrar Cliente & Sincronizar na Operação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRMATION MODAL: ARCHIVE / RESTORE / DELETE CLIENT                     */}
      {/* ========================================================================= */}
      {clientActionModal && clientActionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                  clientActionModal.type === 'delete'
                    ? 'bg-rose-50 text-rose-600'
                    : clientActionModal.type === 'restore'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {clientActionModal.type === 'delete' ? (
                    <Trash2 className="w-5 h-5" />
                  ) : (
                    <Archive className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {clientActionModal.type === 'delete'
                      ? 'Excluir ou Arquivar Cliente'
                      : clientActionModal.type === 'restore'
                      ? 'Restaurar Cliente'
                      : 'Arquivar Cliente'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {clientActionModal.clientName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setClientActionModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              {clientActionModal.type === 'delete' ? (
                <>
                  <p>
                    Escolha como deseja prosseguir com o cliente <strong className="text-slate-900">{clientActionModal.clientName}</strong>:
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                    <div>
                      <strong className="text-slate-800 block mb-0.5">Opção 1: Arquivar (Recomendado)</strong>
                      <span className="text-slate-500">Remove o cliente da esteira ativa de produção, preservando o histórico de arquivos e relatórios. Pode ser desarquivado a qualquer momento.</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <strong className="text-rose-700 block mb-0.5">Opção 2: Excluir Definitivamente</strong>
                      <span className="text-slate-500">Exclui permanentemente todos os registros (contas, projetos, contatos e histórico) deste cliente.</span>
                    </div>
                  </div>
                </>
              ) : clientActionModal.type === 'restore' ? (
                <p>
                  Deseja reativar o cliente <strong className="text-slate-900">{clientActionModal.clientName}</strong> e restaurar seus cards de operação para a esteira ativa?
                </p>
              ) : (
                <p>
                  Deseja arquivar o cliente <strong className="text-slate-900">{clientActionModal.clientName}</strong>? Todos os seus cards de operação serão movidos para o arquivo e poderão ser restaurados a qualquer momento pelo filtro &quot;Arquivados&quot;.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setClientActionModal(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>

              {clientActionModal.type === 'delete' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      archiveClientCascade(clientActionModal.clientName, 'archive');
                      if (selectedClientForModal && isClientMatch(selectedClientForModal.account, clientActionModal.clientName)) {
                        setSelectedClientForModal(null);
                      }
                      setSuccessBanner(`Cliente "${clientActionModal.clientName}" foi arquivado com sucesso!`);
                      setClientActionModal(null);
                      setTimeout(() => setSuccessBanner(null), 4000);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Arquivar Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteClientPermanently(clientActionModal.clientName);
                      if (selectedClientForModal && isClientMatch(selectedClientForModal.account, clientActionModal.clientName)) {
                        setSelectedClientForModal(null);
                      }
                      setSuccessBanner(`Cliente "${clientActionModal.clientName}" foi excluído definitivamente.`);
                      setClientActionModal(null);
                      setTimeout(() => setSuccessBanner(null), 4000);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Excluir Definitivamente
                  </button>
                </>
              ) : clientActionModal.type === 'restore' ? (
                <button
                  type="button"
                  onClick={() => {
                    restoreClientCascade(clientActionModal.clientName);
                    if (selectedClientForModal && isClientMatch(selectedClientForModal.account, clientActionModal.clientName)) {
                      setSelectedClientForModal(null);
                    }
                    setSuccessBanner(`Cliente "${clientActionModal.clientName}" foi restaurado com sucesso!`);
                    setClientActionModal(null);
                    setTimeout(() => setSuccessBanner(null), 4000);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Restaurar Cliente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    archiveClientCascade(clientActionModal.clientName, 'archive');
                    if (selectedClientForModal && isClientMatch(selectedClientForModal.account, clientActionModal.clientName)) {
                      setSelectedClientForModal(null);
                    }
                    setSuccessBanner(`Cliente "${clientActionModal.clientName}" foi arquivado e removido da Operação.`);
                    setClientActionModal(null);
                    setTimeout(() => setSuccessBanner(null), 4000);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Arquivar Cliente
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
