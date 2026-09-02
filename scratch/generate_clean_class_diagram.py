# -*- coding: utf-8 -*-
import os

def generate_perfect_class_diagram():
    xml = '''<mxfile host="app.diagrams.net" agent="Antigravity">
  <diagram id="ClassDiagram_Miniposh_Revisi" name="Class Diagram Sistem Reward Toko Miniposh">
    <mxGraphModel dx="1600" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1654" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- ====================================================================== -->
        <!-- KOLOM 1 (KIRI): KELAS INDEPENDEN & PENDUKUNG                          -->
        <!-- ====================================================================== -->

        <!-- CLASS: Admin -->
        <mxCell id="c_admin" value="Admin" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="240" height="230" as="geometry" />
        </mxCell>
        <mxCell id="c_admin_attr" value="- id: String [PK]&#xa;- email: String [UQ]&#xa;- password: String&#xa;- name: String&#xa;- phone: String?&#xa;- createdAt: DateTime&#xa;- updatedAt: DateTime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_admin">
          <mxGeometry y="26" width="240" height="120" as="geometry" />
        </mxCell>
        <mxCell id="c_admin_sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=#6c8ebf;" vertex="1" parent="c_admin">
          <mxGeometry y="146" width="240" height="8" as="geometry" />
        </mxCell>
        <mxCell id="c_admin_meth" value="+ authenticate(email, pwd): Boolean&#xa;+ updateProfile(data): Admin&#xa;+ resetPassword(id, newPwd): Boolean" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_admin">
          <mxGeometry y="154" width="240" height="76" as="geometry" />
        </mxCell>

        <!-- CLASS: StoreTransactionSource (POS Staging Table) -->
        <mxCell id="c_store" value="StoreTransactionSource (POS)" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="40" y="340" width="240" height="230" as="geometry" />
        </mxCell>
        <mxCell id="c_store_attr" value="- id: String [PK]&#xa;- transactionId: String [UQ]&#xa;- memberId: String&#xa;- memberName: String&#xa;- transactionDate: DateTime&#xa;- amount: Float&#xa;- phone: String?&#xa;- cashierName: String?" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_store">
          <mxGeometry y="26" width="240" height="135" as="geometry" />
        </mxCell>
        <mxCell id="c_store_sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=#d6b656;" vertex="1" parent="c_store">
          <mxGeometry y="161" width="240" height="8" as="geometry" />
        </mxCell>
        <mxCell id="c_store_meth" value="+ fetchStoreTransactions(): List&#xa;+ parseCSV(file): List" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_store">
          <mxGeometry y="169" width="240" height="61" as="geometry" />
        </mxCell>

        <!-- CLASS: SystemSetting -->
        <mxCell id="c_setting" value="SystemSetting" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="40" y="650" width="240" height="210" as="geometry" />
        </mxCell>
        <mxCell id="c_setting_attr" value="- id: String [PK]&#xa;- key: String [UQ]&#xa;- value: String&#xa;- label: String&#xa;- type: String&#xa;- updatedAt: DateTime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_setting">
          <mxGeometry y="26" width="240" height="110" as="geometry" />
        </mxCell>
        <mxCell id="c_setting_sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=#666666;" vertex="1" parent="c_setting">
          <mxGeometry y="136" width="240" height="8" as="geometry" />
        </mxCell>
        <mxCell id="c_setting_meth" value="+ getSetting(key): String&#xa;+ updateSetting(key, val): Void" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_setting">
          <mxGeometry y="144" width="240" height="66" as="geometry" />
        </mxCell>


        <!-- ====================================================================== -->
        <!-- KOLOM 2 (TENGAH): CORE MEMBER & ENTITAS TRANSAKSIONAL                 -->
        <!-- ====================================================================== -->

        <!-- CLASS: Member -->
        <mxCell id="c_member" value="Member" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="380" y="40" width="260" height="240" as="geometry" />
        </mxCell>
        <mxCell id="c_member_attr" value="- id: String [PK]&#xa;- memberId: String [UQ]&#xa;- name: String&#xa;- email: String?&#xa;- phone: String?&#xa;- totalPoints: Float&#xa;- totalSpent: Float&#xa;- transactionCount: Int" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_member">
          <mxGeometry y="26" width="260" height="135" as="geometry" />
        </mxCell>
        <mxCell id="c_member_sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=#82b366;" vertex="1" parent="c_member">
          <mxGeometry y="161" width="260" height="8" as="geometry" />
        </mxCell>
        <mxCell id="c_member_meth" value="+ updatePoints(points: Float): Void&#xa;+ recalculateTotalStats(): Void&#xa;+ deductPoints(amount: Float): Void" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_member">
          <mxGeometry y="169" width="260" height="71" as="geometry" />
        </mxCell>

        <!-- CLASS: RewardWinner -->
        <mxCell id="c_winner" value="RewardWinner" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="380" y="340" width="260" height="250" as="geometry" />
        </mxCell>
        <mxCell id="c_winner_attr" value="- id: String [PK]&#xa;- campaignId: String [FK]&#xa;- memberId: String [FK]&#xa;- rank: Int&#xa;- pointsAtWin: Float&#xa;- spentAtWin: Float&#xa;- transactionsAtWin: Int&#xa;- rewardClaimed: Boolean&#xa;- claimedAt: DateTime?" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_winner">
          <mxGeometry y="26" width="260" height="150" as="geometry" />
        </mxCell>
        <mxCell id="c_winner_sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=#9673a6;" vertex="1" parent="c_winner">
          <mxGeometry y="176" width="260" height="8" as="geometry" />
        </mxCell>
        <mxCell id="c_winner_meth" value="+ markAsClaimed(notes): Void&#xa;+ cancelClaim(): Void&#xa;+ getWinnerDetails(): Object" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_winner">
          <mxGeometry y="184" width="260" height="66" as="geometry" />
        </mxCell>

        <!-- CLASS: RewardRedemption -->
        <mxCell id="c_redeem" value="RewardRedemption" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#f8cecc;strokeColor=#b85450;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="380" y="650" width="260" height="260" as="geometry" />
        </mxCell>
        <mxCell id="c_redeem_attr" value="- id: String [PK]&#xa;- memberId: String [FK]&#xa;- catalogId: String [FK]&#xa;- pointsUsed: Float&#xa;- claimCode: String [UQ]&#xa;- status: String&#xa;- redeemedAt: DateTime&#xa;- processedAt: DateTime?" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_redeem">
          <mxGeometry y="26" width="260" height="145" as="geometry" />
        </mxCell>
        <mxCell id="c_redeem_sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=#b85450;" vertex="1" parent="c_redeem">
          <mxGeometry y="171" width="260" height="8" as="geometry" />
        </mxCell>
        <mxCell id="c_redeem_meth" value="+ createRedemption(): String&#xa;+ approveRedemption(adminId): Void&#xa;+ rejectRedemption(reason): Void&#xa;+ completeRedemption(): Void" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_redeem">
          <mxGeometry y="179" width="260" height="81" as="geometry" />
        </mxCell>


        <!-- ====================================================================== -->
        <!-- KOLOM 3 (KANAN): TRANSAKSI, CAMPAIGN, DAN KATALOG                     -->
        <!-- ====================================================================== -->

        <!-- CLASS: Transaction -->
        <mxCell id="c_txn" value="Transaction" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="740" y="40" width="260" height="240" as="geometry" />
        </mxCell>
        <mxCell id="c_txn_attr" value="- id: String [PK]&#xa;- memberId: String [FK]&#xa;- transactionDate: DateTime&#xa;- amount: Float&#xa;- pointsEarned: Float&#xa;- pointsExpiryDate: DateTime?&#xa;- pointsExpired: Boolean&#xa;- description: String?" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_txn">
          <mxGeometry y="26" width="260" height="145" as="geometry" />
        </mxCell>
        <mxCell id="c_txn_sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=#82b366;" vertex="1" parent="c_txn">
          <mxGeometry y="171" width="260" height="8" as="geometry" />
        </mxCell>
        <mxCell id="c_txn_meth" value="+ calculatePoints(rate): Float&#xa;+ checkDuplicate(key): Boolean&#xa;+ markPointsExpired(): Void" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_txn">
          <mxGeometry y="179" width="260" height="61" as="geometry" />
        </mxCell>

        <!-- CLASS: RewardCampaign -->
        <mxCell id="c_campaign" value="RewardCampaign" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="740" y="340" width="260" height="250" as="geometry" />
        </mxCell>
        <mxCell id="c_campaign_attr" value="- id: String [PK]&#xa;- name: String&#xa;- description: String?&#xa;- criteria: String&#xa;- winnersCount: Int&#xa;- startDate: DateTime&#xa;- endDate: DateTime&#xa;- status: String" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_campaign">
          <mxGeometry y="26" width="260" height="145" as="geometry" />
        </mxCell>
        <mxCell id="c_campaign_sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=#9673a6;" vertex="1" parent="c_campaign">
          <mxGeometry y="171" width="260" height="8" as="geometry" />
        </mxCell>
        <mxCell id="c_campaign_meth" value="+ determineWinners(): List&lt;RewardWinner&gt;&#xa;+ applyMultiLevelTieBreaker(): List&#xa;+ exportWinnersToCSV(): File" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_campaign">
          <mxGeometry y="179" width="260" height="71" as="geometry" />
        </mxCell>

        <!-- CLASS: RewardCatalog -->
        <mxCell id="c_catalog" value="RewardCatalog" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#f8cecc;strokeColor=#b85450;fontSize=12;" vertex="1" parent="1">
          <mxGeometry x="740" y="650" width="260" height="260" as="geometry" />
        </mxCell>
        <mxCell id="c_catalog_attr" value="- id: String [PK]&#xa;- name: String&#xa;- description: String?&#xa;- pointsRequired: Float&#xa;- stock: Int?&#xa;- category: String?&#xa;- isActive: Boolean&#xa;- validUntil: DateTime?" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_catalog">
          <mxGeometry y="26" width="260" height="145" as="geometry" />
        </mxCell>
        <mxCell id="c_catalog_sep" value="" style="line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=#b85450;" vertex="1" parent="c_catalog">
          <mxGeometry y="171" width="260" height="8" as="geometry" />
        </mxCell>
        <mxCell id="c_catalog_meth" value="+ isAvailable(points: Float): Boolean&#xa;+ reduceStock(quantity: Int): Boolean&#xa;+ restoreStock(quantity: Int): Void" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_catalog">
          <mxGeometry y="179" width="260" height="81" as="geometry" />
        </mxCell>


        <!-- ====================================================================== -->
        <!-- RELASI ASOSIASI UML (GARIS LURUS, BEBAS TABRAKAN / CROSSING)          -->
        <!-- ====================================================================== -->

        <!-- 1. Member (1) to Transaction (1..*) [GARIS HORIZONTAL KANAN] -->
        <mxCell id="rel_mem_txn" edge="1" parent="1" source="c_member" target="c_txn" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=none;strokeWidth=2;strokeColor=#2E7D32;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_mem_txn_s" connectable="0" parent="rel_mem_txn" style="edgeLabel;align=left;verticalAlign=bottom;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1" vertex="1">
          <mxGeometry x="-0.85" relative="1" as="geometry"><mxPoint x="8" y="-12" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_mem_txn_t" connectable="0" parent="rel_mem_txn" style="edgeLabel;align=right;verticalAlign=bottom;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1..*" vertex="1">
          <mxGeometry x="0.85" relative="1" as="geometry"><mxPoint x="-8" y="-12" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_mem_txn_name" connectable="0" parent="rel_mem_txn" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;fontStyle=2;backgroundColor=#ffffff;" value="has history of &gt;" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-12" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 2. Member (1) to RewardWinner (1..*) [GARIS VERTIKAL KE BAWAH] -->
        <mxCell id="rel_mem_win" edge="1" parent="1" source="c_member" target="c_winner" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=none;strokeWidth=2;strokeColor=#6A1B9A;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_mem_win_s" connectable="0" parent="rel_mem_win" style="edgeLabel;align=left;verticalAlign=top;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1" vertex="1">
          <mxGeometry x="-0.8" relative="1" as="geometry"><mxPoint x="12" y="5" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_mem_win_t" connectable="0" parent="rel_mem_win" style="edgeLabel;align=right;verticalAlign=bottom;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1..*" vertex="1">
          <mxGeometry x="0.8" relative="1" as="geometry"><mxPoint x="15" y="-5" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_mem_win_name" connectable="0" parent="rel_mem_win" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;fontStyle=2;backgroundColor=#ffffff;" value="&lt; awarded as" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint x="38" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 3. RewardCampaign (1) to RewardWinner (1..*) [GARIS HORIZONTAL KIRI] -->
        <mxCell id="rel_camp_win" edge="1" parent="1" source="c_campaign" target="c_winner" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=none;strokeWidth=2;strokeColor=#6A1B9A;exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_camp_win_s" connectable="0" parent="rel_camp_win" style="edgeLabel;align=right;verticalAlign=bottom;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1" vertex="1">
          <mxGeometry x="-0.85" relative="1" as="geometry"><mxPoint x="-8" y="-12" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_camp_win_t" connectable="0" parent="rel_camp_win" style="edgeLabel;align=left;verticalAlign=bottom;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1..*" vertex="1">
          <mxGeometry x="0.85" relative="1" as="geometry"><mxPoint x="8" y="-12" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_camp_win_name" connectable="0" parent="rel_camp_win" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;fontStyle=2;backgroundColor=#ffffff;" value="&lt; produces" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-12" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 4. Member (1) to RewardRedemption (1..*) [GARIS ROUTING BEBAS TABRAKAN DI SISI KANAN TENGAH] -->
        <mxCell id="rel_mem_red" edge="1" parent="1" source="c_member" target="c_redeem" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=none;strokeWidth=2;strokeColor=#C62828;exitX=0.2;exitY=1;exitDx=0;exitDy=0;entryX=0.2;entryY=0;entryDx=0;entryDy=0;">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="432" y="310" />
              <mxPoint x="340" y="310" />
              <mxPoint x="340" y="620" />
              <mxPoint x="432" y="620" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="lbl_mem_red_s" connectable="0" parent="rel_mem_red" style="edgeLabel;align=left;verticalAlign=top;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1" vertex="1">
          <mxGeometry x="-0.9" relative="1" as="geometry"><mxPoint x="-15" y="10" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_mem_red_t" connectable="0" parent="rel_mem_red" style="edgeLabel;align=left;verticalAlign=bottom;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1..*" vertex="1">
          <mxGeometry x="0.9" relative="1" as="geometry"><mxPoint x="-20" y="-10" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_mem_red_name" connectable="0" parent="rel_mem_red" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;fontStyle=2;backgroundColor=#ffffff;" value="performs &gt;" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint x="-28" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 5. RewardCatalog (1) to RewardRedemption (1..*) [GARIS HORIZONTAL KIRI] -->
        <mxCell id="rel_cat_red" edge="1" parent="1" source="c_catalog" target="c_redeem" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=none;strokeWidth=2;strokeColor=#C62828;exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_cat_red_s" connectable="0" parent="rel_cat_red" style="edgeLabel;align=right;verticalAlign=bottom;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1" vertex="1">
          <mxGeometry x="-0.85" relative="1" as="geometry"><mxPoint x="-8" y="-12" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_cat_red_t" connectable="0" parent="rel_cat_red" style="edgeLabel;align=left;verticalAlign=bottom;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1..*" vertex="1">
          <mxGeometry x="0.85" relative="1" as="geometry"><mxPoint x="8" y="-12" as="offset" /></mxGeometry>
        </mxCell>
        <mxCell id="lbl_cat_red_name" connectable="0" parent="rel_cat_red" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;fontStyle=2;backgroundColor=#ffffff;" value="&lt; claimed via" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-12" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 6. Staging ETL Dependency (StoreTransactionSource to Member) [GARIS DASHED ORANYE] -->
        <mxCell id="rel_etl_dep" edge="1" parent="1" source="c_store" target="c_member" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;dashed=1;dashPattern=6 3;endArrow=open;strokeWidth=1.5;strokeColor=#F57F17;exitX=1;exitY=0.2;exitDx=0;exitDy=0;entryX=0;entryY=0.8;entryDx=0;entryDy=0;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_etl_dep" connectable="0" parent="rel_etl_dep" style="edgeLabel;align=center;verticalAlign=middle;fontSize=9;fontStyle=2;backgroundColor=#ffffff;" value="&lt;&lt; ETL Sync &gt;&gt;" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-10" as="offset" /></mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>'''
    with open('docs/class_diagram_revisi_v2.xml', 'w', encoding='utf-8') as f:
        f.write(xml)
    print("Generated perfectly routed docs/class_diagram_revisi_v2.xml")

if __name__ == '__main__':
    generate_perfect_class_diagram()
