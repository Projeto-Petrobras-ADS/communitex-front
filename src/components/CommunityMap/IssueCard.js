// /src/components/CommunityMap/IssueCard.js
import React, { useState } from 'react';

// Constantes centralizadas
import { getIssueTypeConfig, getIssueStatusConfig } from '../../constants';

// Utilitários
import { formatDateTime } from '../../utils';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  alpha,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubble as ChatBubbleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

/**
 * Componente de Card para visualização de uma denúncia
 */
const IssueCard = ({ 
  issue, 
  onClose, 
  onSupport, 
  onViewDetails,
  isCompact = false 
}) => {
  const [isSupporting, setIsSupporting] = useState(false);
  const [supportError, setSupportError] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!issue) return null;

  const typeConfig = getIssueTypeConfig(issue.tipo);
  const statusConfig = getIssueStatusConfig(issue.status);

  const handleSupport = async () => {
    if (!onSupport || isSupporting) return;
    
    setIsSupporting(true);
    setSupportError(null);
    
    try {
      const result = await onSupport(issue.id, 'APOIO');
      if (!result.success) {
        setSupportError(result.error);
      }
    } catch (err) {
      setSupportError('Erro ao apoiar denúncia');
    } finally {
      setIsSupporting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!onSupport || isSubmittingComment || !commentText.trim()) return;
    
    setIsSubmittingComment(true);
    setSupportError(null);
    
    try {
      const result = await onSupport(issue.id, 'COMENTARIO', commentText.trim());
      if (result.success) {
        setCommentText('');
        setShowCommentInput(false);
      } else {
        setSupportError(result.error);
      }
    } catch (err) {
      setSupportError('Erro ao enviar comentário');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Versão compacta para popup do mapa
  if (isCompact) {
    return (
      <Card elevation={2} sx={{ minWidth: 250, maxWidth: 300, borderRadius: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: 20 }}>{typeConfig.icon}</Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>
              {issue.titulo}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {issue.descricao?.substring(0, 100)}
            {issue.descricao?.length > 100 ? '...' : ''}
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={isSupporting ? <CircularProgress size={14} /> : <ThumbUpIcon />}
              onClick={handleSupport}
              disabled={isSupporting}
            >
              {issue.totalApoios || 0}
            </Button>
            {onViewDetails && (
              <Button
                size="small"
                variant="contained"
                startIcon={<VisibilityIcon />}
                onClick={() => onViewDetails(issue)}
              >
                Detalhes
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Versão completa
  return (
    <Card 
      elevation={3} 
      sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          bgcolor: alpha(typeConfig.color, 0.1),
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 24 }}>{typeConfig.icon}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>{typeConfig.label}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Imagem */}
      {issue.fotoUrl && (
        <Box
          component="img"
          src={issue.fotoUrl}
          alt={issue.titulo}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      {/* Conteúdo */}
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {issue.titulo}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {issue.descricao}
        </Typography>

        {/* Meta info */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {issue.autorNome || 'Anônimo'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDateTime(issue.dataCriacao)}
            </Typography>
          </Box>
        </Stack>

        {/* Estatísticas */}
        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ThumbUpIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant="body2" fontWeight={600}>
              {issue.totalApoios || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">apoios</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ChatBubbleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant="body2" fontWeight={600}>
              {issue.totalInteracoes || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">interações</Typography>
          </Box>
        </Stack>

        {/* Erro */}
        {supportError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSupportError(null)}>
            {supportError}
          </Alert>
        )}

        {/* Seção de Comentários */}
        {issue.interacoes && issue.interacoes.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              <ChatBubbleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
              Comentários
            </Typography>
            <Stack spacing={1}>
              {issue.interacoes
                .filter(i => i.tipo === 'COMENTARIO')
                .slice(0, 5)
                .map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{
                      p: 1.5,
                      bgcolor: 'background.default',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={600}>
                        {comment.usuarioNome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(comment.dataCriacao)}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{comment.conteudo}</Typography>
                  </Box>
                ))}
            </Stack>
          </Box>
        )}

        {/* Input de Comentário */}
        {showCommentInput && (
          <Box sx={{ mb: 2 }}>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="Digite seu comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              inputProps={{ maxLength: 1000 }}
              size="small"
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {commentText.length}/1000
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setShowCommentInput(false);
                    setCommentText('');
                  }}
                  disabled={isSubmittingComment}
                >
                  Cancelar
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={isSubmittingComment ? <CircularProgress size={14} /> : <SendIcon />}
                  onClick={handleCommentSubmit}
                  disabled={isSubmittingComment || !commentText.trim()}
                >
                  Enviar
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </CardContent>

      <Divider />

      {/* Actions */}
      <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={isSupporting ? <CircularProgress size={14} /> : <ThumbUpIcon />}
          onClick={handleSupport}
          disabled={isSupporting}
        >
          Apoiar
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ChatBubbleIcon />}
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          Comentar
        </Button>
        {onViewDetails && (
          <Button
            size="small"
            variant="contained"
            startIcon={<VisibilityIcon />}
            onClick={() => onViewDetails(issue)}
          >
            Ver Detalhes
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default IssueCard;
