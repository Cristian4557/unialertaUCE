DROP POLICY IF EXISTS "System can insert historial" ON public.reporte_historial;
CREATE POLICY "Authenticated can insert own historial" ON public.reporte_historial FOR INSERT TO authenticated
WITH CHECK (assigned_by IS NULL OR assigned_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "System can insert group history" ON public.group_history;
CREATE POLICY "Authenticated can insert own group history" ON public.group_history FOR INSERT TO authenticated
WITH CHECK (performed_by IS NULL OR performed_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated can view event reports" ON public.evento_reportes;
CREATE POLICY "Authenticated can view event reports" ON public.evento_reportes FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Authenticated can view poll results" ON public.encuesta_respuestas;
CREATE POLICY "Authenticated can view poll results" ON public.encuesta_respuestas FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Usuarios pueden ver compartidos" ON public.publicacion_compartidos;
CREATE POLICY "Usuarios pueden ver compartidos" ON public.publicacion_compartidos FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Usuarios pueden ver contadores de vistas" ON public.publicacion_vistas;
CREATE POLICY "Usuarios pueden ver contadores de vistas" ON public.publicacion_vistas FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Anyone can view post mentions" ON public.publicacion_menciones;
CREATE POLICY "Authenticated can view post mentions" ON public.publicacion_menciones FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Anyone can view comment mentions" ON public.comentario_menciones;
CREATE POLICY "Authenticated can view comment mentions" ON public.comentario_menciones FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Usuarios pueden ver interacciones" ON public.interacciones;
CREATE POLICY "Usuarios pueden ver interacciones" ON public.interacciones FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);